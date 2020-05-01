export default interface StateInterface {
  uid: string;
  CsvByBodyId: { [id: string]: string[] };
  t: number;
}