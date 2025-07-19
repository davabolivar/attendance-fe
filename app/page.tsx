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

      <div className="flex w-full border rounded shadow overflow-hidden">
        {/* Tabel Kiri (Kolom Tetap) */}
        <table className="table-fixed text-sm w-[420px] border-r border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-2 w-[40px] text-center">No</th>
              <th className="border px-2 py-2">Nama</th>
              <th className="border px-2 py-2 text-center">Terlambat</th>
              <th className="border px-2 py-2 text-center">Pulang Cepat</th>
              <th className="border px-2 py-2 text-center">Tidak Checkout</th>
            </tr>
          </thead>
          <tbody>
            {rekap.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border px-2 py-2 text-center">{idx + 1}</td>
                <td className="border px-2 py-2">{row.nama}</td>
                <td className="border px-2 py-2 text-center">{row.terlambat}</td>
                <td className="border px-2 py-2 text-center">{row.pulangCepat}</td>
                <td className="border px-2 py-2 text-center">{row.tidakCheckout}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tabel Kanan (Kolom Absen Harian - Scrollable) */}
        <div className="overflow-x-auto w-full">
          <table className="table-fixed text-sm min-w-max">
            <thead className="bg-gray-100">
              <tr>
                {dates.map(date => (
                  <th key={date} className="border px-2 py-2 min-w-[80px] text-center">
                    {new Date(date).toLocaleDateString('id-ID', {
                      weekday: 'short',
                      day: '2-digit',
                    })}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rekap.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
