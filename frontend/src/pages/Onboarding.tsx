import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerWorker, createPolicy } from '../api'

const zones = ['Guindy', 'Adyar', 'Velachery', 'Tambaram', 'Chromepet', 'Porur', 'Ambattur', 'Pallavaram']
const platforms = ['Zepto', 'Blinkit']
const tiers = [
  { name: 'Basic', price: '~₹35/week', coverage: '₹1,000', days: '≤4 days/week', factor: 4 },
  { name: 'Standard', price: '~₹60/week', coverage: '₹2,000', days: '5–6 days/week', factor: 6 },
  { name: 'Pro', price: '~₹90/week', coverage: '₹3,500', days: '7 days/week', factor: 7 },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [workerId, setWorkerId] = useState<number | null>(null)
  const [suggestedPlan, setSuggestedPlan] = useState<any>(null)

  const [form, setForm] = useState({
    name: '', phone: '', platform: 'Zepto', zone: 'Guindy',
    pincode: '', active_days: 6, avg_hourly_earnings: 75, tenure_weeks: 1
  })

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleRegister = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await registerWorker({ ...form, active_days: Number(form.active_days), avg_hourly_earnings: Number(form.avg_hourly_earnings), tenure_weeks: Number(form.tenure_weeks) })
      const data = res.data
      if (data.error && !data.worker_id) { setError(data.error); return }
      setWorkerId(data.worker_id)
      setSuggestedPlan(data.suggested_plan)
      setStep(2)
    } catch {
      setError('Registration failed. Is the backend running?')
    } finally { setLoading(false) }
  }

  const handleBuyPolicy = async (tier: string) => {
    if (!workerId) return
    setLoading(true)
    try {
      await createPolicy({ worker_id: workerId, tier })
      navigate(`/dashboard/${workerId}`)
    } catch {
      setError('Policy creation failed.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-900">🛵 EarnSafe</h1>
          <p className="text-gray-500 text-sm mt-1">Income protection for delivery partners</p>
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2].map(s => (
              <div key={s} className={`h-2 w-16 rounded-full ${step >= s ? 'bg-blue-600' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}

        {/* Step 1 - Registration Form */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-700">Step 1: Tell us about yourself</h2>

            <input name="name" placeholder="Full Name" value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

            <input name="phone" placeholder="Phone Number" value={form.phone}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

            <select name="platform" value={form.platform} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {platforms.map(p => <option key={p}>{p}</option>)}
            </select>

            <select name="zone" value={form.zone} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {zones.map(z => <option key={z}>{z}</option>)}
            </select>

            <input name="pincode" placeholder="Pincode" value={form.pincode}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500">Days/week</label>
                <input name="active_days" type="number" min={1} max={7} value={form.active_days}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Avg earnings/hr (₹)</label>
                <input name="avg_hourly_earnings" type="number" value={form.avg_hourly_earnings}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <button onClick={handleRegister} disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50">
              {loading ? 'Registering...' : 'Register & See My Plan →'}
            </button>
          </div>
        )}

        {/* Step 2 - Choose Plan */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-700">Step 2: Choose your weekly plan</h2>
            {suggestedPlan && (
              <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
                🤖 AI suggests: <strong>{suggestedPlan.tier} Shield</strong> at <strong>₹{suggestedPlan.weekly_premium}/week</strong>
              </div>
            )}
            {tiers.map(t => (
              <div key={t.name}
                className="border-2 border-gray-100 hover:border-blue-500 rounded-xl p-4 cursor-pointer transition"
                onClick={() => handleBuyPolicy(t.name)}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-800">{t.name} Shield</p>
                    <p className="text-xs text-gray-500">{t.days}</p>
                    <p className="text-xs text-gray-500">Max payout: {t.coverage}/week</p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-600 font-bold">{t.price}</p>
                    <p className="text-xs text-gray-400">per week</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}