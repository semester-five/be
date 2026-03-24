export class DetailMessageVO {
  private constructor(
    readonly title: string,
    readonly content: string,
    readonly actionUrl?: string,
    readonly imageUrl?: string,
  ) {}

  static create(props: {
    title: string;
    content: string;
    actionUrl?: string;
    imageUrl?: string;
  }): DetailMessageVO {
    return new DetailMessageVO(
      props.title,
      props.content,
      props.actionUrl,
      props.imageUrl,
    );
  }
}
