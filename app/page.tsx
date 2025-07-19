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
  const [loading, setLoading] = useState(false)
  const [dates, setDates] = useState<string[]>([])

  // Filter states
  const [startDate, setStartDate] = useState('2025-07-01')
  const [endDate, setEndDate] = useState('2025-07-10')
  const [kategori, setKategori] = useState('Semua')

  const fetchRekap = () => {
    setLoading(true)
    const query = `?startDate=${startDate}&endDate=${endDate}&kategori=${kategori}`
    fetch(`http://localhost:3000/api/rekap${query}`)
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
  }

  useEffect(() => {
    fetchRekap()
  }, [])

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">📊 Rekap Absensi</h1>

      {/* FILTER */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <label className="text-sm">
          Mulai:
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="ml-2 px-2 py-1 border rounded text-sm"
          />
        </label>
        <label className="text-sm">
          Sampai:
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="ml-2 px-2 py-1 border rounded text-sm"
          />
        </label>
        <label className="text-sm">
          Kategori:
          <select
            value={kategori}
            onChange={e => setKategori(e.target.value)}
            className="ml-2 px-2 py-1 border rounded text-sm"
          >
            <option value="Semua">Semua</option>
            <option value="PGE-FO">PGE-FO</option>
            <option value="PGE-UP">PGE-UP</option>
            <option value="Pekerja">Pekerja</option>
          </select>
        </label>
        <button
          onClick={fetchRekap}
          className="px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          View
        </button>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="text-sm text-gray-600">Loading data absensi...</div>
      ) : (
        <div className="overflow-auto max-h-[80vh] border rounded shadow">
          <table className="table-fixed text-sm min-w-max border-collapse">
            <thead className="bg-gray-100">
              <tr className="sticky top-0 z-10 bg-gray-100 shadow">
                <th className="sticky top-0 left-0 z-40 bg-gray-100 px-2 py-2 border w-[40px] text-center">No</th>
                <th className="sticky top-0 left-[40px] z-30 bg-gray-100 px-2 py-2 border w-[220px] text-left">Nama</th>
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
                <tr key={idx}>
                  <td className="sticky left-0 bg-white z-20 px-2 py-2 border text-center w-[40px]">{idx + 1}</td>
                  <td className="sticky left-[40px] bg-white z-10 px-2 py-2 border w-[220px]">{row.nama}</td>
                  {dates.map(date => {
                    const d = row.data[date]
                    const isAbsent = d?.isAbsent === 1
                    const isHoliday = d?.isHoliday === 1

                    let bgColor = ''
                    if (isHoliday) {
                      bgColor = 'bg-green-100 text-green-800 hover:bg-green-200'
                    } else if (isAbsent) {
                      bgColor = 'bg-red-100 text-red-800 hover:bg-red-200'
                    } else {
                      bgColor = 'bg-white hover:bg-gray-100'
                    }

                    return (
                      <td
                        key={date}
                        className={`border px-2 py-1 text-center font-mono text-xs min-w-[80px] transition-colors duration-150 ${bgColor}`}
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
      )}
    </main>
  )
}
