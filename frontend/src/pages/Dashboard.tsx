import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getWorker, getPolicy } from '../api'

export default function Dashboard() {
  const { workerId } = useParams()
  const navigate = useNavigate()
  const [worker, setWorker] = useState<any>(null)
  const [policy, setPolicy] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const id = Number(workerId)
    Promise.all([getWorker(id), getPolicy(id)]).then(([w, p]) => {
      setWorker(w.data)
      setPolicy(p.data)
    }).finally(() => setLoading(false))
  }, [workerId])

  if (loading) return (
    <div className="min-h-screen bg-blue-950 flex items-center justify-center">
      <p className="text-white text-lg">Loading your dashboard...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-900 p-4">
      <div className="max-w-md mx-auto space-y-4 pt-8">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">🛵 EarnSafe</h1>
          <p className="text-blue-300 text-sm">Your income is protected</p>
        </div>

        {/* Worker Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-2xl">👤</div>
            <div>
              <h2 className="font-bold text-gray-800 text-lg">{worker?.name}</h2>
              <p className="text-gray-500 text-sm">{worker?.platform} Partner • {worker?.zone}</p>
              <p className="text-gray-400 text-xs">📞 {worker?.phone}</p>
            </div>
          </div>
        </div>

        {/* Policy Card */}
        {policy && !policy.error ? (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 shadow-lg text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-100 text-sm">Active Policy</p>
                <h3 className="text-2xl font-bold">{policy.tier} Shield ✅</h3>
                <p className="text-green-100 text-sm mt-1">Valid until {policy.week_end}</p>
              </div>
              <div className="text-right">
                <p className="text-green-100 text-sm">Max Coverage</p>
                <p className="text-2xl font-bold">₹{policy.coverage_amount}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-green-400 flex justify-between">
              <div>
                <p className="text-green-100 text-xs">Weekly Premium</p>
                <p className="font-bold">₹{policy.premium}</p>
              </div>
              <div>
                <p className="text-green-100 text-xs">Coverage Factor</p>
                <p className="font-bold">{(policy.coverage_factor * 100).toFixed(0)}%</p>
              </div>
              <div>
                <p className="text-green-100 text-xs">Status</p>
                <p className="font-bold capitalize">{policy.status}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 rounded-2xl p-6 text-center">
            <p className="text-yellow-700">No active policy found.</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <p className="text-3xl font-bold text-blue-600">₹{worker?.avg_hourly_earnings}/hr</p>
            <p className="text-gray-500 text-xs mt-1">Avg Hourly Earnings</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <p className="text-3xl font-bold text-purple-600">{worker?.active_days}</p>
            <p className="text-gray-500 text-xs mt-1">Days/Week Active</p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => navigate(`/claims/${workerId}`)}
            className="bg-white text-blue-700 font-semibold py-3 rounded-xl shadow hover:bg-blue-50 transition text-sm">
            📋 View Claims
          </button>
          <button onClick={() => navigate('/register')}
            className="bg-white text-gray-600 font-semibold py-3 rounded-xl shadow hover:bg-gray-50 transition text-sm">
            ➕ New Worker
          </button>
        </div>

      </div>
    </div>
  )
}