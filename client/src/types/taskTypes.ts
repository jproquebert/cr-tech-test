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

export type CreateTaskDto = {
  Title: string;
  Description?: string | null;
  DueDate?: string | null;
  Status: string;
  AssignedTo: string;
  CreatedBy: string;
};

export type EditTaskDto = {
  Title: string;
  Description?: string | null;
  DueDate?: string | null;
  Status: string;
  AssignedTo: string;
};