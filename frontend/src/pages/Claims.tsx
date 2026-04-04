import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getClaims, simulateTrigger } from '../api'

const triggers = [
  { id: 'heavy_rain', label: '🌧️ Heavy Rain', color: 'bg-blue-500' },
  { id: 'aqi_severe', label: '🌫️ Severe AQI', color: 'bg-gray-500' },
  { id: 'extreme_heat', label: '🥵 Extreme Heat', color: 'bg-orange-500' },
  { id: 'flood', label: '🌊 Flood Alert', color: 'bg-cyan-600' },
  { id: 'civic_disruption', label: '🚧 Civic Disruption', color: 'bg-red-500' },
]

const zones = ['Guindy', 'Adyar', 'Velachery', 'Tambaram', 'Chromepet', 'Porur', 'Ambattur']

export default function Claims() {
  const { workerId } = useParams()
  const navigate = useNavigate()
  const [claims, setClaims] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [simulating, setSimulating] = useState(false)
  const [selectedZone, setSelectedZone] = useState('Guindy')
  const [result, setResult] = useState<any>(null)

  const fetchClaims = () => {
    getClaims(Number(workerId)).then(res => {
      setClaims(res.data.claims || [])
    }).finally(() => setLoading(false))
  }

  useEffect(() => { fetchClaims() }, [workerId])

  const handleSimulate = async (triggerType: string) => {
    setSimulating(true)
    setResult(null)
    try {
      const res = await simulateTrigger({ zone: selectedZone, trigger_type: triggerType })
      setResult(res.data)
      fetchClaims()
    } finally { setSimulating(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-900 p-4">
      <div className="max-w-md mx-auto space-y-4 pt-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate(`/dashboard/${workerId}`)}
            className="text-blue-300 hover:text-white text-sm">← Back</button>
          <h1 className="text-xl font-bold text-white">Claims & Triggers</h1>
        </div>

        {/* Simulate Panel */}
        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <h2 className="font-bold text-gray-800 mb-1">⚡ Simulate a Disruption</h2>
          <p className="text-gray-400 text-xs mb-3">Select a zone and trigger to auto-create a claim</p>

          <select value={selectedZone} onChange={e => setSelectedZone(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {zones.map(z => <option key={z}>{z}</option>)}
          </select>

          <div className="grid grid-cols-2 gap-2">
            {triggers.map(t => (
              <button key={t.id}
                onClick={() => handleSimulate(t.id)}
                disabled={simulating}
                className={`${t.color} text-white text-xs font-semibold py-2.5 px-3 rounded-lg hover:opacity-90 transition disabled:opacity-50`}>
                {simulating ? '...' : t.label}
              </button>
            ))}
          </div>

          {/* Result */}
          {result && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-green-700 font-semibold text-sm">✅ Trigger fired!</p>
              <p className="text-green-600 text-xs mt-1">{result.claims_created} claim(s) created in {result.zone}</p>
              {result.details?.map((d: any) => (
                <div key={d.claim_id} className="mt-2 bg-white rounded-lg p-3 text-xs text-gray-700 space-y-1">
                  <p>👤 <strong>{d.worker}</strong></p>
                  <p>⏱️ Hours lost: <strong>{d.hours_lost}h</strong></p>
                  <p>💰 Payout: <strong className="text-green-600">{d.payout}</strong></p>
                  <p>📱 UPI: {d.upi}</p>
                  <p>Status: {d.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Claims History */}
        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <h2 className="font-bold text-gray-800 mb-3">📋 Claims History</h2>
          {loading ? (
            <p className="text-gray-400 text-sm text-center py-4">Loading...</p>
          ) : claims.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">No claims yet. Simulate a trigger above!</p>
          ) : (
            <div className="space-y-3">
              {claims.map((c: any) => (
                <div key={c.claim_id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm capitalize">{c.trigger.replace('_', ' ')}</p>
                      <p className="text-gray-400 text-xs">{c.zone} • {c.date}</p>
                      <p className="text-gray-500 text-xs mt-1">⏱️ {c.hours_lost}h lost</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-600 font-bold">{c.payout}</p>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{c.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}