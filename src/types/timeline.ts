import { OpportunityStatus } from './opportunity';

export type TimelineEventType =
  | 'CREATED'
  | 'CONTACT_ASSIGNED'
  | 'CONTACT_CREATED'
  | 'VEHICLE_MATCHED'
  | 'STAGE_CHANGED'
  | 'NOTE_ADDED'
  | 'CONTRACT_UPLOADED'
  | 'CLOSED_WON'
  | 'CLOSED_LOST'
  | 'SUPPLIER_ASSIGNED'
  | 'VALUE_UPDATED';

export interface TimelineEvent {
  id: string;
  opportunity_id: string;
  event_type: TimelineEventType;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  created_by: string;
  created_by_name?: string;
}

export interface TimelineEventCreate {
  opportunity_id: string;
  event_type: TimelineEventType;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface StageChangeMetadata {
  from_stage?: OpportunityStatus;
  to_stage: OpportunityStatus;
  from_stage_name?: string;
  to_stage_name: string;
}

export interface ContactMetadata {
  contact_id: string;
  contact_name: string;
  is_new_contact?: boolean;
}

export interface VehicleMetadata {
  vehicle_id: string;
  vehicle_model: string;
  vehicle_year?: number;
  vehicle_price?: number;
}

export interface SupplierMetadata {
  supplier_id: string;
  supplier_name: string;
}

export interface ValueUpdateMetadata {
  old_value?: number;
  new_value: number;
  field_name: string;
}

export interface ContractMetadata {
  file_name: string;
  file_size?: number;
  file_url?: string;
}

export interface CloseMetadata {
  final_value?: number;
  commission?: number;
  loss_reason?: string;
}

export const TIMELINE_EVENT_ICONS: Record<TimelineEventType, string> = {
  CREATED: '🎯',
  CONTACT_ASSIGNED: '👤',
  CONTACT_CREATED: '✨',
  VEHICLE_MATCHED: '🚗',
  STAGE_CHANGED: '➡️',
  NOTE_ADDED: '📝',
  CONTRACT_UPLOADED: '📄',
  CLOSED_WON: '🎉',
  CLOSED_LOST: '❌',
  SUPPLIER_ASSIGNED: '🏢',
  VALUE_UPDATED: '💰'
};
