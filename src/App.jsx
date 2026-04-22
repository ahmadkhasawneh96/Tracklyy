import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'
import {
  Camera,
  MessageSquare,
  PlusCircle,
  Sparkles,
  UtensilsCrossed,
  Flame,
  Beef,
  Wheat,
  Droplets,
  Moon,
  Footprints,
  HeartPulse,
  TrendingUp,
} from 'lucide-react'

const foodDB = {
  eggs: { name: 'Scrambled Eggs', calories: 210, protein: 18, carbs: 2, fat: 15 },
  chicken_rice: {
    name: 'Chicken & Rice Bowl',
    calories: 540,
    protein: 44,
    carbs: 58,
    fat: 14,
  },
  greek_yogurt: {
    name: 'Greek Yogurt Bowl',
    calories: 220,
    protein: 20,
    carbs: 14,
    fat: 8,
  },
  tuna_wrap: { name: 'Tuna Wrap', calories: 390, protein: 32, carbs: 30, fat: 14 },
  steak_potato: {
    name: 'Steak & Potato',
    calories: 610,
    protein: 48,
    carbs: 42,
    fat: 25,
  },
  oats_shake: {
    name: 'Protein Oats Shake',
    calories: 430,
    protein: 36,
    carbs: 42,
    fat: 12,
  },
  ramsi_eggs: {
    name: 'Golden Ramsi Scrambled Eggs',
    calories: 340,
    protein: 24,
    carbs: 10,
    fat: 22,
  },
  salmon_rice: {
    name: 'Salmon Rice Plate',
    calories: 560,
    protein: 38,
    carbs: 47,
    fat: 24,
  },
}

const initialLogs = [
  { id: 1, time: '08:20', method: 'Chat AI', ...foodDB.oats_shake },
  { id: 2, time: '13:10', method: 'Manual', ...foodDB.chicken_rice },
  { id: 3, time: '17:45', method: 'QR Scan', ...foodDB.greek_yogurt },
]

const goalsByMode = {
  cut: { calories: 2200, protein: 180, carbs: 180, fat: 70, rate: '-0.5 kg/week' },
  maintain: { calories: 2700, protein: 170, carbs: 280, fat: 80, rate: 'Stable weight' },
  lean_bulk: { calories: 3000, protein: 185, carbs: 340, fat: 85, rate: '+0.2 kg/week' },
}

const trendData = [
  { day: 'Mon', calories: 2180, target: 2200, weight: 96.8, steps: 7400, sleep: 6.2, hrv: 43, workout: 42 },
  { day: 'Tue', calories: 2310, target: 2200, weight: 96.6, steps: 8800, sleep: 7.1, hrv: 48, workout: 65 },
  { day: 'Wed', calories: 2050, target: 2200, weight: 96.5, steps: 12000, sleep: 7.4, hrv: 52, workout: 58 },
  { day: 'Thu', calories: 2240, target: 2200, weight: 96.2, steps: 9600, sleep: 6.8, hrv: 46, workout: 38 },
  { day: 'Fri', calories: 2150, target: 2200, weight: 96.1, steps: 13100, sleep: 7.8, hrv: 57, workout: 72 },
  { day: 'Sat', calories: 2410, target: 2200, weight: 96.0, steps: 6900, sleep: 8.1, hrv: 61, workout: 20 },
  { day: 'Sun', calories: 2090, target: 2200, weight: 95.9, steps: 11200, sleep: 7.3, hrv: 55, workout: 61 },
]

function MetricCard({ icon: Icon, label, value, sub }) {
  const iconEl = React.createElement(Icon, { className: 'h-4 w-4' })
  return (
    <div className="rounded-[20px] sm:rounded-3xl bg-white p-3 sm:p-4 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        {iconEl}
        <span>{label}</span>
      </div>
      <div className="mt-1.5 text-lg sm:text-2xl font-semibold text-slate-900 break-words">
        {value}
      </div>
      <div className="text-[11px] sm:text-xs leading-4 text-slate-500">{sub}</div>
    </div>
  )
}

function MacroRow({ label, value, goal, icon: Icon }) {
  const pct = Math.min((value / goal) * 100, 100)
  const iconEl = React.createElement(Icon, { className: 'h-4 w-4' })
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-slate-700">
          {iconEl}
          <span>{label}</span>
        </div>
        <span className="font-medium text-slate-900">
          {Math.round(value)} / {goal}
        </span>
      </div>
      <Progress value={pct} className="h-2" />
    </div>
  )
}

function TrendChart({ dataKey, title, subtitle, type = 'line' }) {
  return (
    <Card className="rounded-3xl border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="min-w-0">
        <div className="h-40 sm:h-48 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            {type === 'area' ? (
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey={dataKey} strokeWidth={2} fillOpacity={0.12} />
              </AreaChart>
            ) : (
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey={dataKey} strokeWidth={2} dot={false} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default function MacroFactorAIConceptDemo() {
  const MotionDiv = motion.div
  const [page, setPage] = useState('nutrition')
  const [mode, setMode] = useState('cut')
  const [weight, setWeight] = useState(96.5)
  const [trendWeight, setTrendWeight] = useState(95.9)
  const [logs, setLogs] = useState(initialLogs)
  const [manualFood, setManualFood] = useState('tuna_wrap')
  const [chatInput, setChatInput] = useState(
    'I had 3 eggs, one reef bread, and 50g mozzarella'
  )
  const [aiMessages, setAiMessages] = useState([
    {
      role: 'assistant',
      text: 'Logged your breakfast estimate. You are still low on protein for the day. For dinner, something like Golden Ramsi scrambled eggs or a tuna wrap would fit nicely.',
    },
  ])

  const goal = goalsByMode[mode]

  const totals = useMemo(() => {
    return logs.reduce(
      (acc, item) => ({
        calories: acc.calories + item.calories,
        protein: acc.protein + item.protein,
        carbs: acc.carbs + item.carbs,
        fat: acc.fat + item.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    )
  }, [logs])

  const remaining = useMemo(
    () => ({
      calories: Math.max(goal.calories - totals.calories, 0),
      protein: Math.max(goal.protein - totals.protein, 0),
      carbs: Math.max(goal.carbs - totals.carbs, 0),
      fat: Math.max(goal.fat - totals.fat, 0),
    }),
    [goal, totals]
  )

  const recoveryScore = useMemo(() => {
    const latest = trendData[trendData.length - 1]
    const sleepScore = Math.min((latest.sleep / 8) * 35, 35)
    const hrvScore = Math.min((latest.hrv / 60) * 35, 35)
    const loadBalance = latest.workout < 70 ? 15 : 10
    const stepsScore = latest.steps > 9000 ? 15 : 10
    return Math.round(sleepScore + hrvScore + loadBalance + stepsScore)
  }, [])

  const prediction = useMemo(() => {
    const delta = trendWeight - weight
    if (mode === 'cut') {
      return delta < 0
        ? 'Your trend is moving in the right direction. Keep this intake and you are likely to continue losing steadily.'
        : 'Your trend is flat or up. The app would suggest tightening intake slightly or increasing activity.'
    }
    if (mode === 'maintain') {
      return Math.abs(delta) < 0.4
        ? 'Your weight trend looks stable. Current intake seems close to maintenance.'
        : 'Your weight is drifting. The app would nudge calories up or down based on the weekly trend.'
    }
    return delta > 0
      ? 'You are gaining as planned. If gym performance is improving, this pace looks reasonable.'
      : 'You are not gaining yet. The app would recommend a modest calorie increase.'
  }, [mode, trendWeight, weight])

  const recoveryInsight = useMemo(() => {
    if (recoveryScore >= 80)
      return 'Recovery is strong today. HRV and sleep suggest you can handle a harder session.'
    if (recoveryScore >= 65)
      return 'Recovery is decent. A normal workout is fine, but keep an eye on fatigue.'
    return 'Recovery looks suppressed. Consider lower intensity, more sleep, and slightly higher food quality today.'
  }, [recoveryScore])

  const suggestions = useMemo(() => {
    const opts = Object.values(foodDB).filter((f) => f.protein >= 20)
    return opts
      .map((item) => ({
        ...item,
        fit:
          Math.abs(item.calories - remaining.calories) * 0.4 +
          Math.abs(item.protein - remaining.protein) * 1.4 +
          Math.abs(item.carbs - remaining.carbs) * 0.3,
      }))
      .sort((a, b) => a.fit - b.fit)
      .slice(0, 3)
  }, [remaining])

  const addManual = () => {
    const item = foodDB[manualFood]
    setLogs((prev) => [...prev, { id: Date.now(), time: 'Now', method: 'Manual', ...item }])
  }

  const scanQR = () => {
    const pool = [foodDB.salmon_rice, foodDB.tuna_wrap, foodDB.ramsi_eggs]
    const item = pool[Math.floor(Math.random() * pool.length)]
    setLogs((prev) => [...prev, { id: Date.now(), time: 'Now', method: 'QR Scan', ...item }])
  }

  const sendChat = () => {
    if (!chatInput.trim()) return
    const text = chatInput.toLowerCase()
    let item = foodDB.ramsi_eggs
    if (text.includes('tuna')) item = foodDB.tuna_wrap
    else if (text.includes('chicken')) item = foodDB.chicken_rice
    else if (text.includes('yogurt')) item = foodDB.greek_yogurt
    else if (text.includes('egg')) item = foodDB.ramsi_eggs

    setAiMessages((prev) => [
      ...prev,
      { role: 'user', text: chatInput },
      {
        role: 'assistant',
        text: `I estimated that as ${item.name}: ${item.calories} kcal, ${item.protein}g protein, ${item.carbs}g carbs, ${item.fat}g fat. Based on your goal, you still need about ${Math.max(goal.protein - (totals.protein + item.protein), 0)}g protein today.`,
      },
    ])
    setLogs((prev) => [...prev, { id: Date.now(), time: 'Now', method: 'Chat AI', ...item }])
    setChatInput('')
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-[120px] sm:pb-24">
      <div className="mx-auto w-full max-w-md space-y-3 px-3 pt-3 sm:space-y-4 sm:p-4">
        <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="rounded-[28px] border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="text-base sm:text-lg font-semibold text-slate-900">
                AI Macro + Recovery Coach
              </div>
              <div className="text-xs sm:text-sm text-slate-500">
                Phone-first concept with nutrition and recovery
              </div>
            </CardContent>
          </Card>
        </MotionDiv>

        {page === 'nutrition' && (
          <div className="space-y-4">
            <Card className="rounded-[28px] border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Nutrition</CardTitle>
                    <CardDescription>
                      Track intake, see macro gaps, and follow calorie trends.
                    </CardDescription>
                  </div>
                  <Badge className="rounded-full">{mode}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={mode} onValueChange={setMode}>
                  <SelectTrigger className="rounded-2xl h-11 text-sm">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cut">Cut</SelectItem>
                    <SelectItem value="maintain">Maintain</SelectItem>
                    <SelectItem value="lean_bulk">Lean Bulk</SelectItem>
                  </SelectContent>
                </Select>

                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <MetricCard icon={Flame} label="Calories" value={totals.calories} sub={`${remaining.calories} left`} />
                  <MetricCard icon={Beef} label="Protein" value={`${totals.protein}g`} sub={`${remaining.protein}g left`} />
                  <MetricCard icon={Wheat} label="Carbs" value={`${totals.carbs}g`} sub={`${remaining.carbs}g left`} />
                  <MetricCard icon={Droplets} label="Fat" value={`${totals.fat}g`} sub={`${remaining.fat}g left`} />
                </div>

                <div className="space-y-4 rounded-3xl bg-white p-4 ring-1 ring-slate-100">
                  <MacroRow label="Calories" value={totals.calories} goal={goal.calories} icon={Flame} />
                  <MacroRow label="Protein" value={totals.protein} goal={goal.protein} icon={Beef} />
                  <MacroRow label="Carbs" value={totals.carbs} goal={goal.carbs} icon={Wheat} />
                  <MacroRow label="Fat" value={totals.fat} goal={goal.fat} icon={Droplets} />
                </div>

                <div className="rounded-3xl bg-slate-900 p-4 text-slate-50">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <TrendingUp className="h-4 w-4" /> Prediction
                    </div>
                    <Badge variant="default" className="rounded-full">
                      {goal.rate}
                    </Badge>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="text-[11px] text-slate-300">Current</div>
                      <Input
                        inputMode="decimal"
                        value={String(weight)}
                        onChange={(e) => {
                          const next = Number.parseFloat(e.target.value)
                          if (!Number.isNaN(next)) setWeight(next)
                          if (e.target.value.trim() === '') setWeight(0)
                        }}
                        className="h-10 rounded-2xl border-slate-700 bg-slate-950/40 text-slate-50 placeholder:text-slate-400 focus-visible:ring-slate-400"
                        placeholder="kg"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="text-[11px] text-slate-300">Trend</div>
                      <Input
                        inputMode="decimal"
                        value={String(trendWeight)}
                        onChange={(e) => {
                          const next = Number.parseFloat(e.target.value)
                          if (!Number.isNaN(next)) setTrendWeight(next)
                          if (e.target.value.trim() === '') setTrendWeight(0)
                        }}
                        className="h-10 rounded-2xl border-slate-700 bg-slate-950/40 text-slate-50 placeholder:text-slate-400 focus-visible:ring-slate-400"
                        placeholder="kg"
                      />
                    </div>
                  </div>
                  <div className="mt-3 text-sm leading-6 text-slate-50">{prediction}</div>
                </div>
              </CardContent>
            </Card>

            <TrendChart
              dataKey="calories"
              title="Calorie Trend"
              subtitle="Daily intake increases and decreases across the week"
              type="area"
            />
            <TrendChart
              dataKey="weight"
              title="Weight Trend"
              subtitle="Smoothed body weight change, not just scale noise"
            />

            <Card className="rounded-[28px] border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Food Coach</CardTitle>
                <CardDescription>Chat, manual entry, or QR logging in one place.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="chat" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3 rounded-2xl h-auto gap-1 p-1">
                    <TabsTrigger value="chat" className="rounded-2xl px-2 py-2 text-xs sm:text-sm">
                      <MessageSquare className="mr-1 sm:mr-2 h-4 w-4" /> AI
                    </TabsTrigger>
                    <TabsTrigger value="manual" className="rounded-2xl px-2 py-2 text-xs sm:text-sm">
                      <PlusCircle className="mr-1 sm:mr-2 h-4 w-4" /> Manual
                    </TabsTrigger>
                    <TabsTrigger value="qr" className="rounded-2xl px-2 py-2 text-xs sm:text-sm">
                      <Camera className="mr-1 sm:mr-2 h-4 w-4" /> QR
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="chat">
                    <div className="space-y-3">
                      <ScrollArea className="h-56 sm:h-64 rounded-[20px] sm:rounded-3xl border bg-white p-3 sm:p-4">
                        <div className="space-y-3">
                          {aiMessages.map((m, i) => (
                            <div
                              key={i}
                              className={`max-w-[92%] rounded-2xl p-2.5 sm:p-3 text-xs sm:text-sm ${
                                m.role === 'assistant'
                                  ? 'bg-slate-100 text-slate-900'
                                  : 'ml-auto bg-slate-900 text-white'
                              }`}
                            >
                              {m.text}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      <Textarea
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className="min-h-[88px] sm:min-h-[90px] rounded-2xl text-sm"
                        placeholder="Tell the AI what you ate in normal language..."
                      />
                      <Button onClick={sendChat} className="w-full rounded-2xl h-11">
                        Log with AI
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="manual">
                    <div className="space-y-4 rounded-3xl border bg-white p-4">
                      <Select value={manualFood} onValueChange={setManualFood}>
                        <SelectTrigger className="rounded-2xl h-11 text-sm">
                          <SelectValue placeholder="Select food" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(foodDB).map(([key, item]) => (
                            <SelectItem key={key} value={key}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={addManual} className="w-full rounded-2xl">
                        Add Food Manually
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="qr">
                    <div className="space-y-4 rounded-3xl border bg-white p-4">
                      <div className="rounded-3xl border-2 border-dashed p-8 text-center text-sm text-slate-500">
                        Simulated QR scanner for packaged foods or restaurant-linked meal cards.
                      </div>
                      <Button onClick={scanQR} className="w-full rounded-2xl">
                        Simulate QR Scan
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 rounded-3xl bg-slate-50 p-4">
                  <div className="mb-3 flex items-center gap-2 font-medium text-slate-900">
                    <UtensilsCrossed className="h-4 w-4" /> Smart Suggestions
                  </div>
                  <div className="grid gap-3">
                    {suggestions.map((s, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-2xl bg-white p-3 ring-1 ring-slate-100"
                      >
                        <div>
                          <div className="font-medium">{s.name}</div>
                          <div className="text-sm text-slate-500">
                            {s.calories} kcal · {s.protein}g protein
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="rounded-2xl"
                          onClick={() =>
                            setLogs((prev) => [
                              ...prev,
                              {
                                id: Date.now() + idx,
                                time: 'Suggested',
                                method: 'AI Suggestion',
                                ...s,
                              },
                            ])
                          }
                        >
                          Add
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-sm text-slate-600">
                    Example recommendation: “Have you tried{' '}
                    <span className="font-semibold">Golden Ramsi scrambled eggs</span> for
                    dinner? It fits your remaining protein better than a random snack.”
                  </div>
                </div>

                <div className="mt-6 rounded-3xl bg-slate-50 p-4">
                  <div className="mb-3 text-sm font-medium text-slate-900">
                    Today’s Food Log
                  </div>
                  <div className="space-y-2">
                    {logs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between rounded-2xl bg-white p-3 ring-1 ring-slate-100"
                      >
                        <div>
                          <div className="font-medium">{log.name}</div>
                          <div className="text-xs text-slate-500">
                            {log.time} · {log.method}
                          </div>
                        </div>
                        <div className="text-right text-sm text-slate-600">
                          <div>{log.calories} kcal</div>
                          <div>
                            {log.protein}P / {log.carbs}C / {log.fat}F
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {page === 'recovery' && (
          <div className="space-y-4">
            <Card className="rounded-[28px] border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Recovery</CardTitle>
                <CardDescription>
                  Wearable-connected trends for sleep, HRV, steps, and workout load.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <MetricCard
                    icon={HeartPulse}
                    label="Recovery Score"
                    value={`${recoveryScore}%`}
                    sub="Based on HRV, sleep, and load"
                  />
                  <MetricCard icon={Moon} label="Sleep" value="7.3 h" sub="Last night" />
                  <MetricCard icon={HeartPulse} label="HRV" value="55 ms" sub="Above your weekly baseline" />
                  <MetricCard icon={Footprints} label="Steps" value="11.2k" sub="Today so far" />
                </div>

                <div className="rounded-3xl bg-slate-900 p-4 text-slate-50">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Sparkles className="h-4 w-4" /> AI Recovery Insight
                  </div>
                  <div className="mt-2 text-sm leading-6">{recoveryInsight}</div>
                </div>
              </CardContent>
            </Card>

            <TrendChart dataKey="sleep" title="Sleep Trend" subtitle="Sleep duration across the week" type="area" />
            <TrendChart dataKey="hrv" title="HRV Trend" subtitle="Readiness and nervous system recovery" />
            <TrendChart dataKey="steps" title="Steps Trend" subtitle="Daily movement from your wearable" type="area" />
            <TrendChart dataKey="workout" title="Workout Load Trend" subtitle="How hard your recent sessions were" />

            <Card className="rounded-[28px] border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Integrated Decision Layer</CardTitle>
                <CardDescription>
                  The differentiator: food, body weight, and recovery all influence each other.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-100">
                  If sleep drops and HRV is low, the app can reduce training strain suggestions
                  and recommend slightly more carbs or an earlier dinner.
                </div>
                <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-100">
                  If steps and workouts go up for multiple days, calorie targets can increase
                  automatically to match expenditure trends.
                </div>
                <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-100">
                  If recovery is strong and your weight trend is on plan, the app keeps intake
                  stable instead of overreacting to one scale reading.
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="h-28 sm:h-24" />

        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur pb-[max(env(safe-area-inset-bottom),0.5rem)]">
          <div className="mx-auto flex w-full max-w-md items-center justify-around gap-2 px-3 py-3">
            <button
              onClick={() => setPage('nutrition')}
              className={`flex flex-1 min-w-0 flex-col items-center justify-center rounded-2xl px-3 py-2.5 text-xs font-medium transition ${
                page === 'nutrition'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Flame className="mb-1 h-5 w-5" />
              Nutrition
            </button>
            <button
              onClick={() => setPage('recovery')}
              className={`flex flex-1 min-w-0 flex-col items-center justify-center rounded-2xl px-3 py-2.5 text-xs font-medium transition ${
                page === 'recovery'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <HeartPulse className="mb-1 h-5 w-5" />
              Recovery
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
