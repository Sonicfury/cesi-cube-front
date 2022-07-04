export enum EStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected'
}

export const STATUS_LABELS = new Map<EStatus, string>([
  [EStatus.PENDING, 'À valider'],
  [EStatus.ACCEPTED, 'Validée'],
  [EStatus.REJECTED, 'Rejetée'],
])
