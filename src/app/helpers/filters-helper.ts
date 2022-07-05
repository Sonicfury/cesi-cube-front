export class LaravelQueryBuilder {
  public filters: LaravelQueryFilter[][] = [[]]
  public sorts: LaravelQuerySort[] = []
  public page: LaravelQueryPage = new LaravelQueryPage(0, 10)
  public sums: Set<string> = new Set<string>()
  public withs: Set<string> = new Set<string>()

  constructor() {
  }

  public addFilter(field: string,
                   op: '=' | '!=' | '<>' | '>' | '>=' | '<' | '<=' | 'like' | 'not like' | 'in' | 'not' | 'is',
                   value: string,
                   has?: boolean): LaravelQueryBuilder {
    const filter = has ? new LaravelQueryFilter(field, op, value, has) : new LaravelQueryFilter(field, op, value)
    this.filters[0].push(filter)

    return this
  }

  public removeFilter(field: string): LaravelQueryBuilder {
    this.filters[0] = this.filters[0].filter(f => f.field !== field)

    return this
  }

  public addSort(field: string, dir: 'asc' | 'desc'): LaravelQueryBuilder {
    const exists = this.sorts.find(s => s.field === field)
    if (exists) {
      exists.dir = dir

      return this
    }
    const sort = new LaravelQuerySort(field, dir)
    this.sorts.push(sort)

    return this
  }

  public removeSort(field: string) {
    this.sorts = this.sorts.filter(s => s.field !== field)

    return this
  }

  public clearSorts() {
    this.sorts = []

    return this
  }

  public pageOffset(offset: number): LaravelQueryBuilder {
    this.page.offset = offset

    return this
  }

  public pageLimit(limit: number): LaravelQueryBuilder {
    this.page.limit = limit

    return this
  }

  public clearPage(limit?: number): LaravelQueryBuilder {
    this.page.offset = 0
    if (limit) this.page.limit = limit

    return this
  }

  public addSum(sum: string): LaravelQueryBuilder {
    this.sums.add(sum)

    return this
  }

  public removeSum(sum: string): LaravelQueryBuilder {
    this.sums.delete(sum)

    return this
  }

  public addWith(wiz: string): LaravelQueryBuilder {
    this.withs.add(wiz)

    return this
  }

  public removeWith(wiz: string): LaravelQueryBuilder {
    this.withs.delete(wiz)

    return this
  }
}

export class LaravelQueryFilter {
  constructor(public field: string,
              public op: '=' | '!=' | '<>' | '>' | '>=' | '<' | '<=' | 'like' | 'not like' | 'in' | 'not' | 'is',
              public value: string,
              public has?: boolean) {
  }
}

export class LaravelQuerySort {
  constructor(public field: string, public dir: 'asc' | 'desc') {
  }
}

export class LaravelQueryPage {
  constructor(public offset: number, public limit: number) {
  }
}
