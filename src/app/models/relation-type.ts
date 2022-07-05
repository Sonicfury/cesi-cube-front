export class RelationType {
  public id?: number
  public name?: string
  public createdAt?: Date
  public updatedAt?: Date

  constructor() {
  }
}

export enum ERelationType {
  CONJOINT = 'conjoint(e)',
  AMI = 'ami(e)',
  FAMILLE = 'famille',
  PROFESSIONNEL = 'professionnel',
  AUTRES = 'aucun'
}

export const RELATION_TYPES: Map<ERelationType, string> = new Map<ERelationType, string>([
  [ERelationType.CONJOINT, 'Conjoint.e'],
  [ERelationType.AMI, 'Ami.e'],
  [ERelationType.FAMILLE, 'Famille'],
  [ERelationType.PROFESSIONNEL, 'Professionnel'],
  [ERelationType.AUTRES, 'Autres'],
])

export const RELATION_ICONS: Map<ERelationType, string> = new Map<ERelationType, string>([
  [ERelationType.CONJOINT, 'favorite'],
  [ERelationType.AMI, 'diversity_2'],
  [ERelationType.FAMILLE, 'family_restroom'],
  [ERelationType.PROFESSIONNEL, 'business_center'],
  [ERelationType.AUTRES, 'groups'],
])
