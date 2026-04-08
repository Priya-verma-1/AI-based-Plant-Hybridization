// // // ResultPage.jsx
// // // Receives navigation state: { result, plant1Name, plant2Name }
// // // Backend prediction response shape:
// // //   result.data = { plantA, plantB, predicted_hybrid, traits: { height, leaf_shape, ... }, prediction_date, source }
// // //   result.history_id = "<ObjectId>"

// // import { useLocation, useNavigate, Link } from 'react-router-dom'

// // // Trait display config — maps backend snake_case keys to labels + emoji
// // const TRAIT_CONFIG = {
// //   height:       { label: 'Height',               emoji: '📏', unit: 'cm' },
// //   leaf_shape:   { label: 'Leaf Shape',           emoji: '🍃' },
// //   flower_color: { label: 'Flower Color',         emoji: '🌸' },
// //   climate:      { label: 'Climate',              emoji: '🌍' },
// //   resistance:   { label: 'Disease Resistance',   emoji: '🛡️' },
// //   growth_days:  { label: 'Growth Duration',      emoji: '⏱️', unit: 'days' },
// //   yield_level:  { label: 'Yield Level',          emoji: '🌾' },
// // }

// // function TraitBadge({ traitKey, value }) {
// //   const config = TRAIT_CONFIG[traitKey] || { label: traitKey, emoji: '🔬' }
// //   const display = config.unit ? `${value} ${config.unit}` : String(value ?? '—')

// //   return (
// //     <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-sage-200 hover:-translate-y-0.5 transition-transform">
// //       <span className="text-xl mt-0.5 flex-shrink-0">{config.emoji}</span>
// //       <div>
// //         <p className="text-xs font-semibold text-sage-400 uppercase tracking-wider mb-0.5">
// //           {config.label}
// //         </p>
// //         <p className="text-sm font-medium text-sage-800">{display}</p>
// //       </div>
// //     </div>
// //   )
// // }

// // export default function ResultPage() {
// //   const { state } = useLocation()
// //   const navigate  = useNavigate()

// //   if (!state?.result) {
// //     return (
// //       <div className="min-h-screen flex flex-col items-center justify-center py-20 px-4 text-center">
// //         <div className="text-5xl mb-4">🔍</div>
// //         <h2 className="font-display text-2xl text-forest-800 mb-2">No Result Found</h2>
// //         <p className="text-gray-500 mb-6 max-w-sm">
// //           Navigate here from the Predict page to see your hybrid result.
// //         </p>
// //         <Link to="/predict" className="btn-primary">🌱 Go to Prediction</Link>
// //       </div>
// //     )
// //   }

// //   const { result, plant1Name, plant2Name } = state

// //   // Backend wraps response as: { success, data: { plantA, plantB, traits, ... }, history_id }
// //   // predictHybrid() returns the full axios response.data, so unwrap .data here
// //   const prediction = result?.data || result
// //   const traits     = prediction?.traits || {}
// //   const hybridName = prediction?.predicted_hybrid || `${plant1Name} × ${plant2Name} Hybrid`
// //   const source     = prediction?.source || 'rule_based'
// //   const pDate      = prediction?.prediction_date || new Date().toISOString().split('T')[0]

// //   // Order traits for display
// //   const ORDERED = ['height','leaf_shape','flower_color','climate','resistance','growth_days','yield_level']
// //   const traitEntries = ORDERED.filter(k => traits[k] !== undefined && traits[k] !== null)

// //   return (
// //     <div className="min-h-screen bg-organic py-10 px-4 sm:px-6 animate-fade-in">
// //       <div className="max-w-3xl mx-auto">
// //         {/* Breadcrumb */}
// //         {/* <div className="flex items-center gap-2 text-forest-500 text-sm mb-6">
// //           <Link to="/" className="hover:text-forest-700">🏠</Link>
// //           <span className="text-gray-400">/</span>
// //           <Link to="/predict" className="hover:text-forest-700">Predict</Link>
// //           <span className="text-gray-400">/</span>
// //           <span>Result</span>
// //         </div> */}

// //         {/* Success banner */}
// //         <div className="flex items-center gap-3 bg-forest-50 border border-forest-200 rounded-xl px-5 py-3 mb-6">
// //           <span className="text-2xl">✅</span>
// //           <div>
// //             <p className="font-semibold text-forest-800 text-sm">Prediction Complete!</p>
// //             <p className="text-xs text-forest-600">
// //               Hybrid traits for <strong>{plant1Name}</strong> × <strong>{plant2Name}</strong> have been analysed.
// //             </p>
// //           </div>
// //           {/* <div className="ml-auto text-right">
// //             <span className={`badge text-xs ${source === 'ml_api' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
// //               {source === 'ml_api' ? '🤖 ML Model' : '📐 Rule-based'}
// //             </span>
// //           </div> */}
// //         </div>

// //         {/* Main result card */}
// //         <div className="card shadow-md mb-6">
// //           {/* Header */}
// //           <div className="flex items-start justify-between gap-4 pb-4 mb-5 border-b border-sage-100">
// //             <div>
// //               <h2 className="font-display text-2xl font-bold text-sage-900 mb-1">{hybridName}</h2>
// //               <div className="flex flex-wrap items-center gap-2 text-sm text-sage-500">
// //                 <span className="badge bg-forest-50 text-forest-700 border border-forest-100">
// //                   {plant1Name || prediction?.plantA || '—'}
// //                 </span>
// //                 <span className="text-forest-400 font-bold">×</span>
// //                 <span className="badge bg-earth-50 text-earth-700 border border-earth-100">
// //                   {plant2Name || prediction?.plantB || '—'}
// //                 </span>
// //               </div>
// //             </div>
// //             <div className="w-14 h-14 bg-gradient-to-br from-forest-100 to-earth-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
// //               🧬
// //             </div>
// //           </div>

// //           {/* Traits grid */}
// //           {traitEntries.length > 0 ? (
// //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
// //               {traitEntries.map(key => (
// //                 <TraitBadge key={key} traitKey={key} value={traits[key]} />
// //               ))}
// //             </div>
// //           ) : (
// //             <p className="text-sage-400 text-center py-6 text-sm">
// //               No trait data returned. Check that the backend prediction is working.
// //             </p>
// //           )}

// //           <p className="text-xs text-sage-400 text-center mt-5 pt-4 border-t border-sage-100">
// //             * Predictions are AI-generated estimates based on parent plant genetics · {pDate}
// //           </p>
// //         </div>

// //         {/* Actions */}
// //         <div className="flex flex-wrap gap-3">
// //           <button onClick={() => navigate('/predict')} className="btn-primary">
// //             🔄 New Prediction
// //           </button>
// //           <Link to="/history" className="btn-secondary">📜 View History</Link>
// //           <button onClick={() => window.print()} className="btn-secondary">🖨️ Print</button>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

















// // ResultPage.jsx — ML-only prediction result display

// import { useLocation, useNavigate, Link } from 'react-router-dom'

// const TRAIT_CONFIG = {
//   height:       { label: 'Height',             emoji: '📏', unit: 'cm'   },
//   leaf_shape:   { label: 'Leaf Shape',         emoji: '🍃'               },
//   flower_color: { label: 'Flower Color',       emoji: '🌸'               },
//   climate:      { label: 'Climate',            emoji: '🌍'               },
//   resistance:   { label: 'Disease Resistance', emoji: '🛡️'              },
//   growth_days:  { label: 'Growth Duration',    emoji: '⏱️', unit: 'days' },
//   yield_level:  { label: 'Yield Level',        emoji: '🌾'               },
// }

// function TraitBadge({ traitKey, value }) {
//   const config = TRAIT_CONFIG[traitKey] || { label: traitKey, emoji: '🔬' }
//   const display = config.unit ? `${value} ${config.unit}` : String(value ?? '—')
//   return (
//     <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-sage-200 hover:-translate-y-0.5 transition-transform">
//       <span className="text-xl mt-0.5 flex-shrink-0">{config.emoji}</span>
//       <div>
//         <p className="text-xs font-semibold text-sage-400 uppercase tracking-wider mb-0.5">
//           {config.label}
//         </p>
//         <p className="text-sm font-medium text-sage-800">{display}</p>
//       </div>
//     </div>
//   )
// }

// function ConfidenceBar({ value }) {
//   if (!value) return null
//   const pct = Math.round(value * 100)
//   const color = pct >= 85 ? 'bg-green-500' : pct >= 70 ? 'bg-amber-500' : 'bg-red-400'
//   return (
//     <div className="flex items-center gap-3 mt-3 pt-3 border-t border-sage-100">
//       <span className="text-xs text-sage-500 font-medium whitespace-nowrap">
//         Model confidence
//       </span>
//       <div className="flex-1 bg-sage-100 rounded-full h-2">
//         <div
//           className={`${color} h-2 rounded-full transition-all duration-700`}
//           style={{ width: `${pct}%` }}
//         />
//       </div>
//       <span className="text-xs font-bold text-sage-700 whitespace-nowrap">{pct}%</span>
//     </div>
//   )
// }

// export default function ResultPage() {
//   const { state } = useLocation()
//   const navigate  = useNavigate()

//   if (!state?.result) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center py-20 px-4 text-center">
//         <div className="text-5xl mb-4">🔍</div>
//         <h2 className="font-display text-2xl text-forest-800 mb-2">No Result Found</h2>
//         <p className="text-gray-500 mb-6 max-w-sm">
//           Navigate here from the Predict page to see your hybrid result.
//         </p>
//         <Link to="/predict" className="btn-primary">🌱 Go to Prediction</Link>
//       </div>
//     )
//   }

//   const { result, plant1Name, plant2Name } = state

//   // Unwrap response: predictHybrid() returns full axios response.data
//   // Shape: { success, data: { plantA, plantB, traits, confidence, ... }, history_id }
//   const prediction  = result?.data || result
//   const traits      = prediction?.traits || {}
//   const hybridName  = prediction?.predicted_hybrid || `${plant1Name} × ${plant2Name} Hybrid`
//   const confidence  = prediction?.confidence         // overall confidence score 0–1
//   const pDate       = prediction?.prediction_date || new Date().toISOString().split('T')[0]

//   const ORDERED = ['height','leaf_shape','flower_color','climate','resistance','growth_days','yield_level']
//   const traitEntries = ORDERED.filter(k => traits[k] !== undefined && traits[k] !== null)

//   return (
//     <div className="min-h-screen bg-organic py-10 px-4 sm:px-6 animate-fade-in">
//       <div className="max-w-3xl mx-auto">

//         {/* Breadcrumb */}
//         <div className="flex items-center gap-2 text-forest-500 text-sm mb-6">
//           <Link to="/" className="hover:text-forest-700">🏠</Link>
//           <span className="text-gray-400">/</span>
//           <Link to="/predict" className="hover:text-forest-700">Predict</Link>
//           <span className="text-gray-400">/</span>
//           <span>Result</span>
//         </div>

//         {/* Success banner */}
//         <div className="flex items-center gap-3 bg-forest-50 border border-forest-200 rounded-xl px-5 py-3 mb-6">
//           <span className="text-2xl">✅</span>
//           <div className="flex-1">
//             <p className="font-semibold text-forest-800 text-sm">ML Prediction Complete!</p>
//             <p className="text-xs text-forest-600">
//               AI-powered hybrid analysis for{' '}
//               <strong>{plant1Name}</strong> × <strong>{plant2Name}</strong>
//             </p>
//           </div>
//           {/* ML badge — always shown, no rule-based alternative */}
//           <span className="badge bg-blue-50 text-blue-700 border border-blue-200 text-xs whitespace-nowrap">
//             🤖 Random Forest ML
//           </span>
//         </div>

//         {/* Main result card */}
//         <div className="card shadow-md mb-6">
//           {/* Header */}
//           <div className="flex items-start justify-between gap-4 pb-4 mb-5 border-b border-sage-100">
//             <div>
//               <h2 className="font-display text-2xl font-bold text-sage-900 mb-1">
//                 {hybridName}
//               </h2>
//               <div className="flex flex-wrap items-center gap-2 text-sm text-sage-500">
//                 <span className="badge bg-forest-50 text-forest-700 border border-forest-100">
//                   {plant1Name || prediction?.plantA || '—'}
//                 </span>
//                 <span className="text-forest-400 font-bold">×</span>
//                 <span className="badge bg-earth-50 text-earth-700 border border-earth-100">
//                   {plant2Name || prediction?.plantB || '—'}
//                 </span>
//               </div>
//             </div>
//             <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-forest-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
//               🧬
//             </div>
//           </div>

//           {/* Traits grid */}
//           {traitEntries.length > 0 ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//               {traitEntries.map(key => (
//                 <TraitBadge key={key} traitKey={key} value={traits[key]} />
//               ))}
//             </div>
//           ) : (
//             <p className="text-sage-400 text-center py-6 text-sm">
//               No trait data returned. Ensure the ML service is running.
//             </p>
//           )}

//           {/* Confidence bar */}
//           <ConfidenceBar value={confidence} />

//           <p className="text-xs text-sage-400 text-center mt-4 pt-3 border-t border-sage-100">
//             Predicted by Random Forest ML models · {pDate}
//           </p>
//         </div>

//         {/* Actions */}
//         <div className="flex flex-wrap gap-3">
//           <button onClick={() => navigate('/predict')} className="btn-primary">
//             🔄 New Prediction
//           </button>
//           <Link to="/history" className="btn-secondary">📜 View History</Link>
//           <button onClick={() => window.print()} className="btn-secondary">🖨️ Print</button>
//         </div>
//       </div>
//     </div>
//   )
// }





































// ResultPage.jsx — ML predictions with always-visible descriptions

import { useLocation, useNavigate, Link } from 'react-router-dom'

const TRAIT_CONFIG = {
  height:       { label: 'Height',             emoji: '📏', unit: 'cm'   },
  leaf_shape:   { label: 'Leaf Shape',         emoji: '🍃'               },
  flower_color: { label: 'Flower Color',       emoji: '🌸'               },
  climate:      { label: 'Climate',            emoji: '🌍'               },
  resistance:   { label: 'Disease Resistance', emoji: '🛡️'              },
  growth_days:  { label: 'Growth Duration',    emoji: '⏱️', unit: 'days' },
  yield_level:  { label: 'Yield Level',        emoji: '🌾'               },
}

// ── Trait card — description always visible below the value ───────────────────
function TraitCard({ traitKey, value, description }) {
  const config  = TRAIT_CONFIG[traitKey] || { label: traitKey, emoji: '🔬' }
  const display = config.unit ? `${value} ${config.unit}` : String(value ?? '—')

  return (
    <div className="bg-white border border-sage-200 rounded-xl overflow-hidden hover:border-forest-300 hover:shadow-sm transition-all duration-200 flex flex-col">
      {/* Value row */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        {/* <span className="text-2xl flex-shrink-0">{config.emoji}</span> */}
        <div>
          {/* <p className="text-xs font-semibold text-sage-400 uppercase tracking-wider mb-0.5">
            {config.label}
          </p> */}
          <p className="text-base font-bold text-sage-900 leading-tight">{config.label} - {display}</p>
        </div>
      </div>

      {/* Description — always visible */}
      {description && (
        <div className="px-4 pb-4">
          <div className="bg-forest-50 border-l-2 border-forest-400 rounded-r-lg px-3 py-2.5">
            <p className="text-s text-sage-800 leading-relaxed">{description}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Hybrid overview summary ───────────────────────────────────────────────────
function HybridSummary({ traits, hybridName, plant1Name, plant2Name }) {
  const { height, growth_days, resistance, yield_level, climate, flower_color } = traits
  const growthCat = parseFloat(growth_days) < 90  ? 'fast-maturing'
                  : parseFloat(growth_days) < 150 ? 'medium-cycle' : 'long-cycle'
  const heightCat = parseFloat(height) < 80  ? 'compact'
                  : parseFloat(height) < 180 ? 'medium-height' : 'tall'
  const yieldNote = (yield_level === 'High' || yield_level === 'Very High')
    ? 'excellent commercial potential'
    : yield_level === 'Low' ? 'niche or research use' : 'moderate commercial viability'

  return (
    <div className="bg-gradient-to-br p-2.5 mb-2.5">
      {/* <div className="flex items-center gap-2 mb-2">
        <span className="text-base">📋</span>
        <h3 className="font-semibold text-forest-800 text-sm">Hybrid Overview</h3>
      </div> */}
      <p className="text-s text-sage-700 leading-relaxed">
        <strong>{hybridName}</strong> is an AI-predicted hybrid of{' '}
        <span className="text-forest-700 font-medium">{plant1Name}</span> and{' '}
        <span className="text-forest-700 font-medium">{plant2Name}</span> — a{' '}
        <strong>{heightCat}</strong>, <strong>{growthCat}</strong> plant suited to{' '}
        <strong>{climate}</strong> conditions, producing{' '}
        <strong>{flower_color?.toLowerCase()}</strong> flowers with{' '}
        <strong>{resistance?.toLowerCase()}</strong> disease resistance and{' '}
        <strong>{yield_level?.toLowerCase()}</strong> yield ({yieldNote}).
      </p>
    </div>
  )
}

// ── Confidence bar ────────────────────────────────────────────────────────────
function ConfidenceBar({ value }) {
  if (!value) return null
  const pct   = Math.round(value * 100)
  const color = pct >= 85 ? 'bg-green-500' : pct >= 70 ? 'bg-amber-500' : 'bg-red-400'
  const label = pct >= 85 ? 'High confidence' : pct >= 70 ? 'Moderate confidence' : 'Low confidence'
  return (
    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-sage-100">
      <span className="text-xs text-sage-500 font-medium whitespace-nowrap">{label}</span>
      <div className="flex-1 bg-sage-100 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-sage-700 whitespace-nowrap">{pct}%</span>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ResultPage() {
  const { state } = useLocation()
  const navigate  = useNavigate()

  if (!state?.result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="font-display text-2xl text-forest-800 mb-2">No Result Found</h2>
        <p className="text-gray-500 mb-6 max-w-sm">Navigate here from the Predict page.</p>
        <Link to="/predict" className="btn-primary">🌱 Go to Prediction</Link>
      </div>
    )
  }

  const { result, plant1Name, plant2Name } = state
  const prediction   = result?.data || result
  const traits       = prediction?.traits             || {}
  const descriptions = prediction?.trait_descriptions || {}
  const hybridName   = prediction?.predicted_hybrid   || `${plant1Name} × ${plant2Name} Hybrid`
  const confidence   = prediction?.confidence
  const pDate        = prediction?.prediction_date    || new Date().toISOString().split('T')[0]

  const ORDERED      = ['height','leaf_shape','flower_color','climate','resistance','growth_days','yield_level']
  const traitEntries = ORDERED.filter(k => traits[k] !== undefined && traits[k] !== null)

  return (
    <div className="min-h-screen bg-organic py-10 px-4 sm:px-6 animate-fade-in">
      <div className="max-w-3xl mx-auto">

        {/* Breadcrumb */}
        {/* <div className="flex items-center gap-2 text-forest-500 text-sm mb-6">
          <Link to="/" className="hover:text-forest-700">🏠</Link>
          <span className="text-gray-400">/</span>
          <Link to="/predict" className="hover:text-forest-700">Predict</Link>
          <span className="text-gray-400">/</span>
          <span>Result</span>
        </div> */}

        {/* Success banner */}
        <div className="flex items-center gap-3 bg-forest-50 border border-forest-200 rounded-xl px-5 py-3 mb-6">
          <span className="text-2xl">✅</span>
          <div className="flex-1">
            <p className="font-semibold text-forest-800 text-sm">ML Prediction Complete!</p>
            <p className="text-xs text-forest-600">
              AI-powered hybrid analysis for <strong>{plant1Name}</strong> × <strong>{plant2Name}</strong>
            </p>
          </div>
          {/* <span className="badge bg-blue-50 text-blue-700 border border-blue-200 text-xs whitespace-nowrap">
            🤖 Random Forest ML
          </span> */}
        </div>

        {/* Main card */}
        <div className="card shadow-md mb-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-2 border-sage-100">
            <div>
              <h2 className="font-display text-2xl font-bold text-sage-900 mb-1">{hybridName}</h2>

              {/* <div className="flex flex-wrap items-center gap-2">
                <span className="badge bg-forest-50 text-forest-700 border border-forest-100 text-xs">
                  {plant1Name || prediction?.plantA || '—'}
                </span>
                <span className="text-forest-400 font-bold text-sm">×</span>
                <span className="badge bg-earth-50 text-earth-700 border border-earth-100 text-xs">
                  {plant2Name || prediction?.plantB || '—'}
                </span>
              </div> */}
            </div>
            {/* <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-forest-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
              🧬
            </div> */}
          </div>

          {/* Overview summary */}
          {traitEntries.length > 0 && (
            <HybridSummary
              traits={traits}
              hybridName={hybridName}
              plant1Name={plant1Name}
              plant2Name={plant2Name}
            />
          )}

          {/* Trait cards — descriptions always visible */}
          {traitEntries.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {traitEntries.map(key => (
                <TraitCard
                  key={key}
                  traitKey={key}
                  value={traits[key]}
                  description={descriptions[key]}
                />
              ))}
            </div>
          ) : (
            <p className="text-sage-400 text-center py-6 text-sm">
              No trait data returned. Ensure the ML service is running.
            </p>
          )}

          {/* <ConfidenceBar value={confidence} /> */}

          <p className="text-xs text-sage-400 text-center mt-4 pt-3 border-sage-100">
            Predicted by Random Forest ML models · {pDate}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => navigate('/predict')} className="btn-primary">New Prediction</button>
          <Link to="/history" className="btn-secondary">View History</Link>
          <button onClick={() => window.print()} className="btn-secondary">Print</button>
        </div>
      </div>
    </div>
  )
}