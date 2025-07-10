export type Task = {
  Id: string;
  Title: string;
  Description?: string | null;
  DueDate?: string | null;
  Status: string;
  CreatedBy: string;
  AssignedTo: string;
  CreatedAt: string;
};