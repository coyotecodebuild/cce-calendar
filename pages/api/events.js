export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 'no-store')

  if (req.method === 'GET') {
    try {
      const raw = process.env.SCHOOL_EVENTS
      if (!raw) {
        return res.status(200).json({ events: [], lastUpdated: null, emailCount: 0 })
      }
      const data = JSON.parse(raw)
      return res.status(200).json(data)
    } catch (e) {
      return res.status(200).json({ events: [], lastUpdated: null, emailCount: 0 })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
