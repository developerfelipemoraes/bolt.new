export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          is_active: boolean
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          is_active?: boolean
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          is_active?: boolean
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      system_users: {
        Row: {
          id: string
          organization_id: string
          email: string
          full_name: string
          role: 'super_admin' | 'company_admin' | 'sales' | 'support'
          is_active: boolean
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          organization_id: string
          email: string
          full_name: string
          role: 'super_admin' | 'company_admin' | 'sales' | 'support'
          is_active?: boolean
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          email?: string
          full_name?: string
          role?: 'super_admin' | 'company_admin' | 'sales' | 'support'
          is_active?: boolean
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      contacts: {
        Row: {
          id: string
          full_name: string
          cpf: string | null
          email: string | null
          phone: string | null
          mobile: string | null
          company_id: string | null
          status: string
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          cpf?: string | null
          email?: string | null
          phone?: string | null
          mobile?: string | null
          company_id?: string | null
          status?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          cpf?: string | null
          email?: string | null
          phone?: string | null
          mobile?: string | null
          company_id?: string | null
          status?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      companies: {
        Row: {
          id: string
          legal_name: string
          trade_name: string | null
          cnpj: string
          email: string | null
          phone: string | null
          is_supplier: boolean
          is_customer: boolean
          status: string
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          legal_name: string
          trade_name?: string | null
          cnpj: string
          email?: string | null
          phone?: string | null
          is_supplier?: boolean
          is_customer?: boolean
          status?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          legal_name?: string
          trade_name?: string | null
          cnpj?: string
          email?: string | null
          phone?: string | null
          is_supplier?: boolean
          is_customer?: boolean
          status?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vehicles: {
        Row: {
          id: string
          title: string
          description: string
          status: string
          sale_value: number
          cost_value: number
          supplier_id: string | null
          supplier_name: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string
          status?: string
          sale_value?: number
          cost_value?: number
          supplier_id?: string | null
          supplier_name?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          status?: string
          sale_value?: number
          cost_value?: number
          supplier_id?: string | null
          supplier_name?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      sales_opportunities: {
        Row: {
          id: string
          opportunity_number: string | null
          title: string
          pipeline_id: string
          stage_id: string
          contact_id: string | null
          vehicle_id: string | null
          supplier_id: string | null
          assigned_to: string | null
          status: 'OPEN' | 'WON' | 'LOST'
          expected_close_date: string | null
          estimated_value: number
          final_sale_value: number | null
          commission_value: number | null
          win_date: string | null
          loss_date: string | null
          loss_reason_id: string | null
          contract_url: string | null
          notes: string
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          opportunity_number?: string | null
          title: string
          pipeline_id: string
          stage_id: string
          contact_id?: string | null
          vehicle_id?: string | null
          supplier_id?: string | null
          assigned_to?: string | null
          status?: 'OPEN' | 'WON' | 'LOST'
          expected_close_date?: string | null
          estimated_value?: number
          final_sale_value?: number | null
          commission_value?: number | null
          win_date?: string | null
          loss_date?: string | null
          loss_reason_id?: string | null
          contract_url?: string | null
          notes?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          opportunity_number?: string | null
          title?: string
          pipeline_id?: string
          stage_id?: string
          contact_id?: string | null
          vehicle_id?: string | null
          supplier_id?: string | null
          assigned_to?: string | null
          status?: 'OPEN' | 'WON' | 'LOST'
          expected_close_date?: string | null
          estimated_value?: number
          final_sale_value?: number | null
          commission_value?: number | null
          win_date?: string | null
          loss_date?: string | null
          loss_reason_id?: string | null
          contract_url?: string | null
          notes?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      sales_pipelines: {
        Row: {
          id: string
          name: string
          description: string
          is_default: boolean
          is_active: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          is_default?: boolean
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          is_default?: boolean
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      pipeline_stages: {
        Row: {
          id: string
          pipeline_id: string
          name: string
          description: string
          order_position: number
          color: string
          is_final: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          pipeline_id: string
          name: string
          description?: string
          order_position?: number
          color?: string
          is_final?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          pipeline_id?: string
          name?: string
          description?: string
          order_position?: number
          color?: string
          is_final?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      opportunity_timeline: {
        Row: {
          id: string
          opportunity_id: string
          event_type: string
          event_description: string
          old_value: Json | null
          new_value: Json | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          opportunity_id: string
          event_type: string
          event_description: string
          old_value?: Json | null
          new_value?: Json | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          opportunity_id?: string
          event_type?: string
          event_description?: string
          old_value?: Json | null
          new_value?: Json | null
          created_by?: string | null
          created_at?: string
        }
      }
      loss_reasons: {
        Row: {
          id: string
          name: string
          description: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          is_active?: boolean
          created_at?: string
        }
      }
    }
    Views: {}
    Functions: {
      has_permission: {
        Args: {
          user_id: string
          resource_name: string
          action_name: string
        }
        Returns: boolean
      }
    }
    Enums: {}
  }
}
