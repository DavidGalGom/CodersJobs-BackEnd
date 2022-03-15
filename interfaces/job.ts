export default interface IJob {
  title: string;
  company: string;
  companyAnchor: string;
  jobAnchor: string;
  description: string;
  contactPerson: string;
  salary: number;
  numberOfWorkers?: number;
  startup: boolean;
  location: string;
  desiredProfile: string;
  image: string;
  releaseDate: Date | string;
}
