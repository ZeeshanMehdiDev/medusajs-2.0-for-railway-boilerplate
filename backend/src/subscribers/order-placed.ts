import { Modules } from '@medusajs/utils';
import { IOrderModuleService } from '@medusajs/types';
import { SubscriberArgs, SubscriberConfig } from '@medusajs/medusa';
import { backendUrl } from 'medusa-config';
import { OrderDTO, OrderAddressDTO } from '@medusajs/types/dist/order/common';
import { sendEmail } from '../utils/email-utils';

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<any>) {
  const orderModuleService: IOrderModuleService = container.resolve(Modules.ORDER);
  const order: OrderDTO = await orderModuleService.retrieveOrder(data.id, { relations: ['items', 'summary', 'shipping_address'] });
  const shippingAddress: OrderAddressDTO = order.shipping_address;

  const emailBody = `
    <h1>Order Confirmation</h1>
    <p>Dear ${shippingAddress.first_name} ${shippingAddress.last_name},</p>
    <p>Thank you for your recent order! Here are your order details:</p>

    <h2>Order Summary</h2>
    <p><strong>Order ID:</strong> ${(order as any).display_id}</p>
    <p><strong>Order Date:</strong> ${order.created_at}</p>
    <p><strong>Total:</strong> ${(order.summary as any).raw_current_order_total.value} ${order.currency_code}</p>

    <h2>Shipping Address</h2>
    <p><strong>Name:</strong> ${shippingAddress.first_name} ${shippingAddress.last_name}</p>
    <p><strong>Address:</strong> ${shippingAddress.address_1}</p>
    <p><strong>City:</strong> ${shippingAddress.city}, ${shippingAddress.province} ${shippingAddress.postal_code}</p>
    <p><strong>Country:</strong> ${shippingAddress.country_code}</p>

    <h2>Order Items</h2>
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Quantity</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map(item => `<tr>
            <td>${item.title} - ${item.product_title}</td>
            <td>${item.quantity}</td>
            <td>${item.unit_price} ${order.currency_code}</td>
          </tr>`).join('')}
      </tbody>
    </table>

    <p>You can view your order details <a href="${backendUrl}/admin/orders/${order.id}">here</a>.</p>
  `;

  await sendEmail({
    to: order.email,
    subject: 'Your order has been placed',
    body: emailBody
  }, container);
}

export const config: SubscriberConfig = {
  event: 'order.placed'
};
