export class IsSuccessfulDto<T = any> {
  constructor(
    public successful: boolean,
    public data: T = null,
    public message: string = '',
  ) {}
}
