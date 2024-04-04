export interface SelectionType {
  name: string;
  selectedOption: string;
  otherOptions: SelectionData[];
}

export interface SelectionData {
  value: string;
  viewValue: string;
}
