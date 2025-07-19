'use client'

import { useEffect, useState } from 'react'

type Absensi = {
  nopek: string
  nama: string
  area: string
  data: {
    [date: string]: {
      masuk: string
      keluar: string
      isHoliday: number
      isAbsent?: number
    }
  }
  terlambat: number
  pulangCepat: number
  tidakCheckout: number
}

export default function Home() {
  const [rekap, setRekap] = useState<Absensi[]>([])
  const [loading, setLoading] = useState(true)
  const [dates, setDates] = useState<string[]>([])

  useEffect(() => {
    fetch('http://localhost:3000/api/rekap')
      .then(res => res.json())
      .then(data => {
        setRekap(data)
        if (data.length > 0) {
          setDates(Object.keys(data[0].data))
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Gagal fetch data:', err)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="p-6 text-sm text-gray-600">Loading data absensi...</div>

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">📊 Rekap Absensi</h1>

      <div className="overflow-auto max-h-[80vh] border rounded shadow">
        <table className="table-fixed text-sm min-w-max border-collapse">
          <thead className="bg-gray-100">
            <tr className="sticky top-0 z-10 bg-gray-100 shadow">
              <th className="border px-2 py-2 min-w-[100px] text-center">No</th>
              <th className="border px-2 py-2 min-w-[100px] text-center">Name</th>
              {dates.map(date => (
                <th key={date} className="border px-2 py-2 min-w-[80px] text-center">
                  {new Date(date).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                  })}
                </th>
              ))}
              <th className="border px-2 py-2 min-w-[100px] text-center">Terlambat</th>
              <th className="border px-2 py-2 min-w-[100px] text-center">Pulang Cepat</th>
              <th className="border px-2 py-2 min-w-[100px] text-center">Tidak Checkout</th>
            </tr>
          </thead>

          <tbody>
            {rekap.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-200">
                <td className="border px-2 py-2 text-center min-w-[100px]">{idx+1}</td>
                <td className="border px-2 py-2 text-center min-w-[100px]">{row.nama}</td>
                {dates.map(date => {
                  const d = row.data[date]
                  const isAbsent = d?.isAbsent === 1
                  const isHoliday = d?.isHoliday === 1
                  const bgColor = isHoliday
                    ? 'bg-green-100 text-green-800'
                    : isAbsent
                    ? 'bg-red-100 text-red-800'
                    : ''

                  return (
                    <td
                      key={date}
                      className={`border px-2 py-1 text-center font-mono text-xs min-w-[80px] ${bgColor}`}
                    >
                      <div>{d?.masuk || '-'}</div>
                      <div>{d?.keluar || '-'}</div>
                    </td>
                  )
                })}
                <td className="border px-2 py-2 text-center min-w-[100px]">{row.terlambat}</td>
                <td className="border px-2 py-2 text-center min-w-[100px]">{row.pulangCepat}</td>
                <td className="border px-2 py-2 text-center min-w-[100px]">{row.tidakCheckout}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
