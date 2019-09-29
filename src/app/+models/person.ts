export interface Person {
    id: number;
    email: string;
    type_id: number;
    first_name: string;
    last_name: string;
    phone_number?: string;
    plot_number?: string;
    street_name?: string;
    city_name?: string;
    post_code?: string;
    picture?: string;
    professional?: {id: number};
    customer?: {id: number};
}
