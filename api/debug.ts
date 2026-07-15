export default async function handler(req: any, res: any): Promise<void> {
  const val = process.env.DATABASE_URL;
  res.status(200).json({
    hasDatabaseUrl: !!val,
    length: val ? val.length : 0,
    startsWithPostgres: val ? val.startsWith("postgres") : false,
  });
}
