export class Auth {
  id!: string;
  user_id!: string;
  token!: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data: Partial<Auth>) {
    Object.assign(this, data);
  }

  toJSON() {
    return {
      id: this.id,
      user_id: this.user_id,
      token: this.token,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
