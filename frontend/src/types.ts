export type Role = 'ADMIN' | 'DISPATCHER' | 'TECHNICIAN' | 'CUSTOMER';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type WorkOrderStatus = 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CLOSED' | 'CANCELLED';

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: Role;
  phone?: string;
  active: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: number;
  email: string;
  fullName: string;
  role: Role;
  expiresAt: string;
}

export interface Customer {
  id: number;
  name: string;
  code: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  active: boolean;
  createdAt: string;
}

export interface Site {
  id: number;
  name: string;
  address: string;
  customerId: number;
  customerName?: string;
  contactPerson?: string;
  active: boolean;
  createdAt: string;
}

export interface Part {
  id: number;
  name: string;
  sku: string;
  unitCost: number;
  stockQty: number;
  minStockLevel: number;
  lowStock?: boolean;
  createdAt?: string;
}

export interface WorkOrder {
  id: number;
  code: string;
  title: string;
  description?: string;
  priority: Priority;
  status: WorkOrderStatus;
  customerId: number;
  customerName?: string;
  siteId: number;
  siteName?: string;
  assignedToId?: number;
  assignedToName?: string;
  createdById?: number;
  createdByName?: string;
  slaDueAt?: string;
  slaBreached?: boolean;
  totalPartsCost: number;
  totalLabourMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkOrderStatusHistory {
  id: number;
  fromStatus?: WorkOrderStatus;
  toStatus: WorkOrderStatus;
  changedByName?: string;
  changedAt: string;
  note?: string;
}

export interface PartUsage {
  id: number;
  partName?: string;
  partSku?: string;
  qtyUsed: number;
  unitCostAtTime: number;
  lineTotal: number;
  createdAt: string;
}

export interface TimeLog {
  id: number;
  technicianName?: string;
  minutes: number;
  note?: string;
  loggedAt: string;
}

export interface DashboardMetrics {
  totalWorkOrders: number;
  newWorkOrders: number;
  assignedWorkOrders: number;
  inProgressWorkOrders: number;
  onHoldWorkOrders: number;
  completedWorkOrders: number;
  closedWorkOrders: number;
  cancelledWorkOrders: number;
  slaBreachedCount: number;
  lowStockPartsCount: number;
  slaComplianceRate: number;
}
