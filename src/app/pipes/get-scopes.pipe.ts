import {Pipe, PipeTransform} from '@angular/core';
import {Resource} from "../models/resource";
import {ERelationType, RELATION_ICONS, RELATION_TYPES} from "../models/relation-type";

@Pipe({
  name: 'getScopes'
})
export class GetScopesPipe implements PipeTransform {

  transform(value: Resource, mode: 'simple' | 'extended'): { icon: string, label: string }[] {
    if (!value.relationTypes || !value.relationTypes.length) {
      return [{icon: 'public', label: 'Publique'}]
    }

    if (mode === 'simple') {
      const labels = value.relationTypes
        .reduce((a, c) => `${a}, ${RELATION_TYPES.get(c.name as ERelationType)}`, '')
        .slice(2)

      return [{icon: 'share', label: labels}]
    }

    return value.relationTypes.map(
      rt => ({
        icon: RELATION_ICONS.get(rt.name as ERelationType) as string,
        label: RELATION_TYPES.get(rt.name as ERelationType) as string
      }))
  }
}
