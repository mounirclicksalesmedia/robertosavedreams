declare module 'pesapaljs-v3' {
  interface PesapalConfig {
    key: string;
    secret: string;
    debug?: boolean;
  }

  interface BillingAddress {
    email_address: string;
    phone_number?: string;
    country_code?: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    line_1?: string;
    line_2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    zip_code?: string;
  }

  interface IPNRequest {
    url: string;
    ipn_notification_type: string;
  }

  interface OrderRequest {
    id: string;
    currency: string;
    amount: number;
    description: string;
    callback_url: string;
    notification_id: string;
    billing_address: BillingAddress;
  }

  interface IPNResponse {
    ipn_id: string;
    url: string;
    created_date: string;
    ipn_notification_type: string;
    status: string;
  }

  interface OrderResponse {
    redirect_url: string;
    order_tracking_id: string;
    merchant_reference: string;
    status: string;
  }

  interface PesaPalInstance {
    authenticate(): Promise<string>;
    register_ipn_url(params: IPNRequest): Promise<IPNResponse>;
    submit_order(params: OrderRequest): Promise<OrderResponse>;
    get_transaction_status(params: { OrderTrackingId: string }): Promise<any>;
  }

  const PesaPal: {
    init(config: PesapalConfig): PesaPalInstance;
  };

  export default PesaPal;
} 