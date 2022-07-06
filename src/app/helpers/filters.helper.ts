export class LaravelQueryBuilder {
  private _filters: LaravelQueryFilter[][] = [[]]
  private _sorts: LaravelQuerySort[] = []
  private _page: LaravelQueryPage = new LaravelQueryPage(0, 10)
  private _sums: Set<string> = new Set<string>()
  private _withs: Set<string> = new Set<string>()
  private _query: string = ''

  constructor() {
  }

  public addFilter(field: string,
                   op: '=' | '!=' | '<>' | '>' | '>=' | '<' | '<=' | 'like' | 'not like' | 'in' | 'not' | 'is',
                   value: string|number|boolean,
                   has?: boolean): LaravelQueryBuilder {
    const filter = has ? new LaravelQueryFilter(field, op, value, has) : new LaravelQueryFilter(field, op, value)
    this._filters[0].push(filter)

    return this
  }

  public removeFilter(field: string): LaravelQueryBuilder {
    this._filters[0] = this._filters[0].filter(f => f.field !== field)

    return this
  }

  public addSort(field: string, dir: 'asc' | 'desc'): LaravelQueryBuilder {
    const exists = this._sorts.find(s => s.field === field)
    if (exists) {
      exists.dir = dir

      return this
    }
    const sort = new LaravelQuerySort(field, dir)
    this._sorts.push(sort)

    return this
  }

  public removeSort(field: string) {
    this._sorts = this._sorts.filter(s => s.field !== field)

    return this
  }

  public clearSorts() {
    this._sorts = []

    return this
  }

  public pageOffset(offset: number): LaravelQueryBuilder {
    this._page.offset = offset

    return this
  }

  public pageLimit(limit: number): LaravelQueryBuilder {
    this._page.limit = limit

    return this
  }

  public clearPage(limit?: number): LaravelQueryBuilder {
    this._page.offset = 0
    if (limit) this._page.limit = limit

    return this
  }

  public addSum(sum: string): LaravelQueryBuilder {
    this._sums.add(sum)

    return this
  }

  public removeSum(sum: string): LaravelQueryBuilder {
    this._sums.delete(sum)

    return this
  }

  public addWith(wiz: string): LaravelQueryBuilder {
    this._withs.add(wiz)

    return this
  }

  public removeWith(wiz: string): LaravelQueryBuilder {
    this._withs.delete(wiz)

    return this
  }


  get query(): string {
    this._query = `q=${JSON.stringify({
      page: this._page,
      sorts: this._sorts,
      filters: this._filters,
      sums: Array.from(this._sums),
      withs: Array.from(this._withs)
    })}`

    return this._query;
  }
}

export class LaravelQueryFilter {
  constructor(public field: string,
              public op: '=' | '!=' | '<>' | '>' | '>=' | '<' | '<=' | 'like' | 'not like' | 'in' | 'not' | 'is',
              public value: string|number|boolean,
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
