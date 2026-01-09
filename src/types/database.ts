export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            clients: {
                Row: {
                    id: string
                    company_name: string
                    responsible_name: string
                    responsible_phone: string
                    responsible_email: string | null
                    responsible_role: string | null
                    email: string
                    document: string
                    niche: string
                    connections: number
                    product: string
                    monthly_value: number
                    payment_method: 'pix' | 'credit_card' | 'boleto' | 'transfer'
                    due_date: number
                    notes: string
                    status: 'active' | 'overdue' | 'inactive' | 'cancelled'
                    tags: string[] | null
                    company_phone: string | null
                    created_at: string
                    updated_at: string
                    user_id: string
                }
                Insert: {
                    id?: string
                    company_name: string
                    responsible_name: string
                    responsible_phone: string
                    responsible_email?: string | null
                    responsible_role?: string | null
                    email: string
                    document: string
                    niche: string
                    connections: number
                    product: string
                    monthly_value: number
                    payment_method: 'pix' | 'credit_card' | 'boleto' | 'transfer'
                    due_date: number
                    notes?: string
                    status?: 'active' | 'overdue' | 'inactive' | 'cancelled'
                    tags?: string[] | null
                    company_phone?: string | null
                    created_at?: string
                    updated_at?: string
                    user_id: string
                }
                Update: {
                    id?: string
                    company_name?: string
                    responsible_name?: string
                    responsible_phone?: string
                    responsible_email?: string | null
                    responsible_role?: string | null
                    email?: string
                    document?: string
                    niche?: string
                    connections?: number
                    product?: string
                    monthly_value?: number
                    payment_method?: 'pix' | 'credit_card' | 'boleto' | 'transfer'
                    due_date?: number
                    notes?: string
                    status?: 'active' | 'overdue' | 'inactive' | 'cancelled'
                    tags?: string[] | null
                    company_phone?: string | null
                    created_at?: string
                    updated_at?: string
                    user_id?: string
                }
            }
            profiles: {
                Row: {
                    id: string
                    email: string
                    name: string
                    role: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    name: string
                    role?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    name?: string
                    role?: string
                    created_at?: string
                    updated_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            client_status: 'active' | 'overdue' | 'inactive' | 'cancelled'
            payment_method: 'pix' | 'credit_card' | 'boleto' | 'transfer'
        }
    }
}
