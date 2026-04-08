// // HistoryTable.jsx
// // Backend record shape:
// //   { _id, plantA, plantB, predicted_traits: { height, leaf_shape, flower_color,
// //     climate, resistance, growth_days, yield_level }, createdAt, prediction_date }

// import { useState } from 'react'
// import { Link } from 'react-router-dom'

// const TRAIT_LABELS = {
//   height:       { label: 'Height',     unit: 'cm' },
//   leaf_shape:   { label: 'Leaf Shape',         },
//   flower_color: { label: 'Flower Color',       },
//   climate:      { label: 'Climate',            },
//   resistance:   { label: 'Resistance',         },
//   growth_days:  { label: 'Growth (days)',      },
//   yield_level:  { label: 'Yield',             },
// }

// function formatDate(str) {
//   if (!str) return '—'
//   try {
//     return new Date(str).toLocaleDateString('en-IN', {
//       day: 'numeric', month: 'short', year: 'numeric',
//     })
//   } catch { return str }
// }

// function TraitPill({ value }) {
//   return (
//     <span className="inline-block bg-forest-50 text-forest-700 border border-forest-100 rounded-full px-2.5 py-0.5 text-xs font-medium">
//       {value}
//     </span>
//   )
// }

// function ExpandedRow({ record }) {
//   const traits = record.predicted_traits || {}
//   const entries = Object.entries(TRAIT_LABELS).filter(([k]) => traits[k] !== undefined)

//   return (
//     <tr className="bg-forest-50/40">
//       <td colSpan={5} className="px-4 py-4">
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
//           {entries.map(([key, { label, unit }]) => (
//             <div key={key} className="bg-white rounded-lg p-2.5 border border-forest-100">
//               <p className="text-xs text-sage-400 uppercase tracking-wide mb-0.5">{label}</p>
//               <p className="text-sm font-medium text-sage-800">
//                 {traits[key]}{unit ? ` ${unit}` : ''}
//               </p>
//             </div>
//           ))}
//         </div>
//       </td>
//     </tr>
//   )
// }

// export default function HistoryTable({ records }) {
//   const [expandedId, setExpandedId] = useState(null)

//   if (!records || records.length === 0) {
//     return (
//       <div className="text-center py-16">
//         <div className="text-5xl mb-4">🌱</div>
//         <h3 className="font-display text-xl font-semibold text-sage-700 mb-2">No predictions yet</h3>
//         <p className="text-sage-500 text-sm mb-6">
//           Start your first hybrid plant prediction to see results here.
//         </p>
//         <Link to="/predict" className="btn-primary inline-block">Make a Prediction</Link>
//       </div>
//     )
//   }

//   return (
//     <div className="overflow-x-auto rounded-2xl border border-sage-200">
//       <table className="w-full">
//         <thead>
//           <tr className="bg-forest-700 text-white">
//             <th className="font-medium text-sm text-left px-4 py-3 rounded-tl-2xl">#</th>
//             <th className="font-medium text-sm text-left px-4 py-3">Plant A</th>
//             <th className="font-medium text-sm text-left px-4 py-3">Plant B</th>
//             <th className="font-medium text-sm text-left px-4 py-3 hidden md:table-cell">Date</th>
//             <th className="font-medium text-sm text-center px-4 py-3 rounded-tr-2xl">Traits</th>
//           </tr>
//         </thead>
//         <tbody>
//           {records.map((record, idx) => {
//             const id        = record._id || idx
//             const isExpanded = expandedId === id
//             const traits    = record.predicted_traits || {}

//             return (
//               <>
//                 <tr
//                   key={id}
//                   className={`border-t border-sage-100 hover:bg-forest-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-sage-50/30'}`}
//                 >
//                   <td className="px-4 py-3 text-sage-400 font-mono text-xs">{idx + 1}</td>

//                   {/* plantA — backend field is a string */}
//                   <td className="px-4 py-3">
//                     <span className="badge bg-forest-50 text-forest-700 border border-forest-200 text-xs">
//                       {record.plantA || '—'}
//                     </span>
//                   </td>

//                   {/* plantB */}
//                   <td className="px-4 py-3">
//                     <span className="badge bg-forest-50 text-forest-700 border border-forest-200 text-xs">
//                       {record.plantB || '—'}
//                     </span>
//                   </td>

//                   {/* Date */}
//                   <td className="px-4 py-3 hidden md:table-cell">
//                     <span className="font-mono text-xs text-sage-500">
//                       {formatDate(record.createdAt || record.prediction_date)}
//                     </span>
//                   </td>

//                   {/* Quick trait pills + expand */}
//                   <td className="px-4 py-3 text-center">
//                     {/* <div className="flex flex-wrap gap-1 justify-center mb-1">
//                       {traits.flower_color && <TraitPill value={`🌸 ${traits.flower_color}`} />}
//                       {traits.yield_level  && <TraitPill value={`🌾 ${traits.yield_level}`}  />}
//                     </div> */}
//                     <button
//                       onClick={() => setExpandedId(isExpanded ? null : id)}
//                       className={`text-xs font-medium px-3 py-1 rounded-lg transition-all border
//                         ${isExpanded
//                           ? 'bg-forest-600 text-white border-forest-600'
//                           : 'bg-white text-forest-600 border-forest-200 hover:border-forest-400'}`}
//                     >
//                       {isExpanded ? 'Hide' : 'View'}
//                     </button>
//                   </td>
//                 </tr>

//                 {isExpanded && <ExpandedRow key={`exp-${id}`} record={record} />}
//               </>
//             )
//           })}
//         </tbody>
//       </table>
//     </div>
//   )
// }




































// HistoryTable.jsx
// Backend record shape:
//   { _id, plantA, plantB, predicted_hybrid, predicted_traits, trait_descriptions,
//     prediction_source, prediction_date, createdAt }

import { useState } from 'react'
import { Link } from 'react-router-dom'

const TRAIT_CONFIG = {
  height:       { label: 'Height',             emoji: '📏', unit: 'cm'   },
  leaf_shape:   { label: 'Leaf Shape',         emoji: '🍃'               },
  flower_color: { label: 'Flower Color',       emoji: '🌸'               },
  climate:      { label: 'Climate',            emoji: '🌍'               },
  resistance:   { label: 'Disease Resistance', emoji: '🛡️'              },
  growth_days:  { label: 'Growth Duration',    emoji: '⏱️', unit: 'days' },
  yield_level:  { label: 'Yield Level',        emoji: '🌾'               },
}

const ORDERED_TRAITS = ['height','leaf_shape','flower_color','climate','resistance','growth_days','yield_level']

function formatDate(str) {
  if (!str) return '—'
  try {
    return new Date(str).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  } catch { return str }
}

// ── Single trait card shown in expanded history row ───────────────────────────
function HistoryTraitCard({ traitKey, value, description }) {
  const config  = TRAIT_CONFIG[traitKey] || { label: traitKey, emoji: '🔬' }
  const display = config.unit ? `${value} ${config.unit}` : String(value ?? '—')

  return (
    <div className="bg-white border border-forest-100 rounded-xl overflow-hidden flex flex-col">
      {/* Value */}
      <div className="flex items-center gap-2.5 px-3 pt-3 pb-2">
        {/* <span className="text-lg flex-shrink-0">{config.emoji}</span> */}
        <div>
          {/* <p className="text-xs font-semibold text-sage-400 uppercase tracking-wide mb-0.5">
            {config.label}
          </p> */}
          <p className="text-s font-bold text-sage-900">{config.label} - {display}</p>
        </div>
      </div>

      {/* Description — always visible when it exists */}
      {description && (
        <div className="px-3 pb-3">
          <div className="bg-forest-50 border-l-2 border-forest-400 rounded-r-md px-2.5 py-2">
            <p className="text-s text-forest-800 leading-relaxed">{description}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Expanded detail panel shown below the summary row ────────────────────────
function ExpandedPanel({ record }) {
  const traits       = record.predicted_traits  || {}
  const descriptions = record.trait_descriptions || {}
  const hybridName   = record.predicted_hybrid  || `${record.plantA} × ${record.plantB} Hybrid`
  const traitEntries = ORDERED_TRAITS.filter(k => traits[k] !== undefined && traits[k] !== null)

  // Build overview sentence
  const h = parseFloat(traits.height)
  const g = parseFloat(traits.growth_days)
  const heightCat  = h < 80  ? 'compact' : h < 180 ? 'medium-height' : 'tall'
  const growthCat  = g < 90  ? 'fast-maturing' : g < 150 ? 'medium-cycle' : 'long-cycle'
  const hasDescriptions = Object.keys(descriptions).length > 0

  return (
    <tr className="bg-forest-50/30">
      <td colSpan={5} className="px-4 py-5">

        {/* Hybrid name + overview */}
        {/* <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">🧬</span>
            <h4 className="font-display font-semibold text-sage-900 text-base">{hybridName}</h4>
            <span className="badge bg-blue-50 text-blue-700 border border-blue-100 text-xs">
              🤖 ML Prediction
            </span>
          </div>
          {traits.height && traits.climate && (
            <p className="text-xs text-sage-600 leading-relaxed ml-7">
              A <strong>{heightCat}</strong>, <strong>{growthCat}</strong> hybrid suited to{' '}
              <strong>{traits.climate}</strong> conditions with{' '}
              <strong>{traits.resistance?.toLowerCase()}</strong> disease resistance
              and <strong>{traits.yield_level?.toLowerCase()}</strong> yield.
              {record.prediction_date && (
                <span className="text-sage-400"> · Predicted on {formatDate(record.prediction_date)}</span>
              )}
            </p>
          )}
        </div> */}

        {/* No descriptions notice for old records */}
        {!hasDescriptions && (
          <div className="mb-3 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-xs text-amber-700">
            ℹ️ Descriptions are available for new predictions. Re-run this pair to generate them.
          </div>
        )}

        {/* Trait cards grid with descriptions */}
        {traitEntries.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {traitEntries.map(key => (
              <HistoryTraitCard
                key={key}
                traitKey={key}
                value={traits[key]}
                description={descriptions[key]}
              />
            ))}
          </div>
        ) : (
          <p className="text-sage-400 text-sm text-center py-4">No trait data available.</p>
        )}
      </td>
    </tr>
  )
}

// ── Main table ────────────────────────────────────────────────────────────────
export default function HistoryTable({ records }) {
  const [expandedId, setExpandedId] = useState(null)

  if (!records || records.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">🌱</div>
        <h3 className="font-display text-xl font-semibold text-sage-700 mb-2">No predictions yet</h3>
        <p className="text-sage-500 text-sm mb-6">
          Start your first hybrid plant prediction to see results here.
        </p>
        <Link to="/predict" className="btn-primary inline-block">Make a Prediction</Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-sage-200">
      <table className="w-full">
        <thead>
          <tr className="bg-forest-700 text-white">
            <th className="font-medium text-s text-left px-4 py-3 rounded-tl-2xl">S.No.</th>
            <th className="font-medium text-s text-left px-4 py-3">Parent Plant A</th>
            <th className="font-medium text-s text-left px-4 py-3">Parent Plant B</th>
            <th className="font-medium text-s text-left px-4 py-3 hidden md:table-cell">Date</th>
            <th className="font-medium text-s text-center px-4 py-3 rounded-tr-2xl">Details</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, idx) => {
            const id         = record._id || idx
            const isExpanded = expandedId === id
            const traits     = record.predicted_traits || {}

            return (
              <>
                <tr
                  key={id}
                  className={`border-t border-sage-100 hover:bg-forest-50/50 transition-colors cursor-pointer
                    ${idx % 2 === 0 ? 'bg-white' : 'bg-sage-50/20'}
                    ${isExpanded ? 'bg-forest-50/50' : ''}`}
                  onClick={() => setExpandedId(isExpanded ? null : id)}
                >
                  {/* Index */}
                  <td className="px-4 py-3.5 text-sage-400 font-mono text-xs">{idx + 1}</td>

                  {/* Plant A */}
                  <td className="px-4 py-3.5">
                    <span className="text-forest-700 text-s font-medium">
                      {record.plantA || '—'}
                    </span>
                  </td>

                  {/* Plant B */}
                  <td className="px-4 py-3.5">
                    <span className="text-forest-700 text-s font-medium">
                      {record.plantB || '—'}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="font-mono text-xs text-sage-500">
                      {formatDate(record.createdAt || record.prediction_date)}
                    </span>
                  </td>

                  {/* Quick preview + expand toggle */}
                  <td className="px-4 py-3.5 text-center">
                    <div className="flex flex-col items-center gap-1.5">
                      {/* Quick trait pills */}
                      {/* <div className="flex flex-wrap gap-1 justify-center">
                        {traits.flower_color && (
                          <span className="inline-block bg-pink-50 text-pink-700 border border-pink-100 rounded-full px-2 py-0.5 text-xs">
                            🌸 {traits.flower_color}
                          </span>
                        )}
                        {traits.yield_level && (
                          <span className="inline-block bg-forest-50 text-forest-700 border border-forest-100 rounded-full px-2 py-0.5 text-xs">
                            🌾 {traits.yield_level}
                          </span>
                        )}
                      </div> */}
                      {/* Expand button */}
                      <button
                        className={`text-xs font-medium px-3 py-1 rounded-lg transition-all border
                          ${isExpanded
                            ? 'bg-forest-600 text-white border-forest-600'
                            : 'bg-white text-forest-600 border-forest-200 hover:border-forest-400'
                          }`}
                        onClick={e => { e.stopPropagation(); setExpandedId(isExpanded ? null : id) }}
                      >
                        {isExpanded ? 'Hide' : 'View'}
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Full prediction report with descriptions */}
                {isExpanded && <ExpandedPanel key={`exp-${id}`} record={record} />}
              </>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}