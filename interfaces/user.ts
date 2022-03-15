export default interface IUser {
  userName: string;
  password: string;
  name?: string;
  email?: string;
  isAdmin?: boolean;
  jobsApplied?: [];
  id?: string;
}
