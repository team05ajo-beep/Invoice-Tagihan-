
import React, { useState } from 'react';
import { InvoiceItem } from './types';

const Barcode: React.FC<{ value: string }> = ({ value }) => {
  const generatePattern = () => {
    const bars = [];
    for (let i = 0; i < 75; i++) {
      const rand = Math.random();
      if (rand > 0.35) {
        const width = rand > 0.85 ? '3px' : rand > 0.65 ? '2px' : '1px';
        bars.push(<div key={i} className="bg-black h-full" style={{ width, marginLeft: '0.5px' }} />);
      } else {
        bars.push(<div key={i} className="bg-transparent h-full" style={{ width: '1.2px' }} />);
      }
    }
    return bars;
  };
  
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex items-end h-10 w-full justify-center bg-white overflow-hidden px-2 border-x border-stone-200">
        <div className="bg-black h-full w-[2.5px] mr-[1px]" />
        {generatePattern()}
        <div className="bg-black h-full w-[2.5px] ml-[1px]" />
      </div>
      <div className="mt-1 text-[10px] font-bold tracking-[0.5em] font-mono text-black w-full text-center border-t border-stone-100 pt-1 leading-none">
        {value}
      </div>
    </div>
  );
};

const CustomSignature: React.FC = () => (
  <svg viewBox="0 0 240 120" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
    <path 
      d="M70,95 
         C40,80 35,30 75,25 
         C110,20 120,70 110,95 
         C108,105 105,115 100,105 
         L120,45 
         Q125,75 135,70 
         T150,70 
         T165,75 
         T180,80 
         C190,85 200,82 205,75" 
      fill="none" 
      stroke="#1a237e" 
      strokeWidth="2.8" 
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path 
      d="M105,95 Q160,100 215,90" 
      fill="none" 
      stroke="#1a237e" 
      strokeWidth="2.5" 
      strokeLinecap="round"
    />
    <circle cx="222" cy="85" r="1.5" fill="#1a237e" />
  </svg>
);

const App: React.FC = () => {
  const [showEditor, setShowEditor] = useState(true);
  const [screenshotMode, setScreenshotMode] = useState(false);
  
  const [data, setData] = useState({
    companyName: 'GUCCI',
    parentCompany: 'PT GRAHA CITRA PRIMA',
    headerAddress: 'Plaza Indonesia, Level 1, Unit 46 - 47, Jl. M.H. Thamrin No.30 Kav 28, Jakarta, 10350, Indonesia RR4C+PJ Gondangdia, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta, Indonesia',
    invoiceNumber: '0522/INA26/I/2026',
    date: '13 Januari 2026',
    customerName: 'DELIANA COLLECTION',
    customerAddress: 'Pondok Aren Indah/ Arinda Permai 2 Jl. MAHONI I blok E 5 No. 1 Pondok Aren',
    customerTelp: '6221733168',
    customerUp: 'Ibu Deliana',
    projectName: 'INACRAFT 2026',
    projectPeriod: '04 Februari 2026 s/d 08 Februari 2026',
    items: [
      { id: '1', description: 'MAIN LOBBY NO.97', quantity: 1, size: '', price: 1000000 },
      { id: '2', description: 'BIAYA KEPESERTAAN PADA PAMERAN INACRAFT 2026', quantity: 1, size: '', price: 1000000 },
      { id: '3', description: 'BIAYA TAMBAHAN FASILITAS', quantity: 1, size: '', price: 1000000 },
      { id: '4', description: '-', quantity: 0, size: '', price: 1000000 },
    ] as InvoiceItem[],
    penalty: 500000,
    paymentAccount: '7514 1715 6279 4985',
    accountHolder: 'PT GRAHA CITRA PRIMA',
    issuerName: 'NATALIA OLYVIA WIJAYA',
    issuerTitle: 'Chief Financial Officer (CFO)',
    bottomLabel: 'DOKUMEN OTENTIK',
    copyrightText: '© 2016 - 2025 Guccio Gucci S.p.A. - All rights reserved. SIAE LICENCE # 2294/I/1936',
    notes: 'CATATAN PEMBAYARAN:\n1. Tahap II (100%) Pembayaran Paling Lambat 5 Januari 2026.\n2. Pembayaran dianggap sah bila dana telah efektif di rekening kami.\n3. Mohon cantumkan nomor invoice saat melakukan transfer dana.\n4. Konfirmasi pembayaran dapat dikirimkan melalui email resmi kami.',
    deadlineNotice: 'Batas waktu penyelesaian pembayaran adalah 1×24 jam sejak lampiran invoice diterima'
  });

  const toggleScreenshotMode = () => setScreenshotMode(prev => !prev);

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setData({ ...data, items: newItems });
  };

  const formatCurrency = (num: number) => new Intl.NumberFormat('id-ID').format(num);

  const subtotal = data.items.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 0)), 0);
  const totalBill = subtotal + (data.penalty || 0);

  const inputStyle = "w-full bg-[#1e1e1e] text-stone-200 border border-stone-800 p-2 text-[12px] rounded mb-2 font-['Roboto'] focus:border-stone-500 outline-none";
  const labelStyle = "text-stone-500 text-[10px] font-black uppercase mb-1 block tracking-widest";
  
  return (
    <div className={`min-h-screen ${screenshotMode ? 'bg-stone-100' : 'bg-stone-200'} flex font-['Roboto'] transition-colors duration-500`}>
      {/* SIDEBAR EDITOR */}
      <div className={`no-print bg-[#0f0f0f] h-screen transition-all duration-300 overflow-y-auto ${showEditor && !screenshotMode ? 'w-[400px] p-6' : 'w-0 p-0 overflow-hidden'}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white font-black text-sm uppercase tracking-widest">Editor Invoice</h2>
          <button onClick={() => setShowEditor(false)} className="text-stone-600 hover:text-white text-xl">✕</button>
        </div>
        
        <div className="pb-20 space-y-6">
          <section>
            <h3 className="text-white text-[11px] font-black uppercase mb-3 border-b border-stone-800 pb-1">Branding & Header</h3>
            <label className={labelStyle}>Nama Brand Utama</label>
            <input className={inputStyle} value={data.companyName} onChange={e => setData({...data, companyName: e.target.value})} />
            <label className={labelStyle}>Nama Perusahaan</label>
            <input className={inputStyle} value={data.parentCompany} onChange={e => setData({...data, parentCompany: e.target.value})} />
            <label className={labelStyle}>Alamat Header</label>
            <textarea className={`${inputStyle} h-20`} value={data.headerAddress} onChange={e => setData({...data, headerAddress: e.target.value})} />
          </section>

          <section>
            <h3 className="text-white text-[11px] font-black uppercase mb-3 border-b border-stone-800 pb-1">Detail Invoice</h3>
            <label className={labelStyle}>Nomor Invoice</label>
            <input className={inputStyle} value={data.invoiceNumber} onChange={e => setData({...data, invoiceNumber: e.target.value})} />
            <label className={labelStyle}>Tanggal Invoice</label>
            <input className={inputStyle} value={data.date} onChange={e => setData({...data, date: e.target.value})} />
          </section>

          <section>
            <h3 className="text-white text-[11px] font-black uppercase mb-3 border-b border-stone-800 pb-1">Detail Klien</h3>
            <label className={labelStyle}>Nama Pelanggan</label>
            <input className={inputStyle} value={data.customerName} onChange={e => setData({...data, customerName: e.target.value})} />
            <label className={labelStyle}>Alamat Lengkap</label>
            <textarea className={`${inputStyle} h-16`} value={data.customerAddress} onChange={e => setData({...data, customerAddress: e.target.value})} />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelStyle}>No Telp</label>
                <input className={inputStyle} value={data.customerTelp} onChange={e => setData({...data, customerTelp: e.target.value})} />
              </div>
              <div>
                <label className={labelStyle}>Nama</label>
                <input className={inputStyle} value={data.customerUp} onChange={e => setData({...data, customerUp: e.target.value})} />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-white text-[11px] font-black uppercase mb-3 border-b border-stone-800 pb-1">Detail Proyek</h3>
            <label className={labelStyle}>Code</label>
            <input className={inputStyle} value={data.projectName} onChange={e => setData({...data, projectName: e.target.value})} />
            <label className={labelStyle}>Periode Proyek</label>
            <input className={inputStyle} value={data.projectPeriod} onChange={e => setData({...data, projectPeriod: e.target.value})} />
          </section>

          <section>
            <h3 className="text-white text-[11px] font-black uppercase mb-3 border-b border-stone-800 pb-1">Item Penagihan</h3>
            {data.items.map((item, index) => (
              <div key={item.id} className="p-3 bg-stone-900 mb-3 rounded border border-stone-800 relative">
                <label className={labelStyle}>Keterangan Item {index + 1}</label>
                <input className={inputStyle} value={item.description} onChange={e => updateItem(index, 'description', e.target.value)} />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelStyle}>FSE (Qty)</label>
                    <input className={inputStyle} type="number" value={item.quantity} onChange={e => updateItem(index, 'quantity', parseInt(e.target.value) || 0)} />
                  </div>
                  <div>
                    <label className={labelStyle}>Biaya Satuan</label>
                    <input className={inputStyle} type="number" value={item.price} onChange={e => updateItem(index, 'price', parseInt(e.target.value) || 0)} />
                  </div>
                </div>
              </div>
            ))}
          </section>

          <section>
            <h3 className="text-white text-[11px] font-black uppercase mb-3 border-b border-stone-800 pb-1">Penyesuaian Tagihan</h3>
            <label className={labelStyle}>Denda/Pinalty</label>
            <input className={inputStyle} type="number" value={data.penalty} onChange={e => setData({...data, penalty: parseInt(e.target.value) || 0})} />
            <label className={labelStyle}>Nomor Rekening / Barcode</label>
            <input className={inputStyle} value={data.paymentAccount} onChange={e => setData({...data, paymentAccount: e.target.value})} />
            <label className={labelStyle}>Atas Nama Rekening</label>
            <input className={inputStyle} value={data.accountHolder} onChange={e => setData({...data, accountHolder: e.target.value})} />
          </section>

          <section>
            <h3 className="text-white text-[11px] font-black uppercase mb-3 border-b border-stone-800 pb-1">Footer & Legal</h3>
            <label className={labelStyle}>Deadline Notice (Keterangan Bawah)</label>
            <textarea className={`${inputStyle} h-16`} value={data.deadlineNotice} onChange={e => setData({...data, deadlineNotice: e.target.value})} />
            <label className={labelStyle}>Nama Penandatangan</label>
            <input className={inputStyle} value={data.issuerName} onChange={e => setData({...data, issuerName: e.target.value})} />
            <label className={labelStyle}>Jabatan</label>
            <input className={inputStyle} value={data.issuerTitle} onChange={e => setData({...data, issuerTitle: e.target.value})} />
            <label className={labelStyle}>Teks Copyright</label>
            <textarea className={`${inputStyle} h-16`} value={data.copyrightText} onChange={e => setData({...data, copyrightText: e.target.value})} />
            <label className={labelStyle}>Label Dokumen</label>
            <input className={inputStyle} value={data.bottomLabel} onChange={e => setData({...data, bottomLabel: e.target.value})} />
            <label className={labelStyle}>Catatan Pembayaran (Notes)</label>
            <textarea className={`${inputStyle} h-32`} value={data.notes} onChange={e => setData({...data, notes: e.target.value})} />
          </section>
        </div>
      </div>

      {/* DOCUMENT VIEWPORT */}
      <div className={`flex-grow overflow-auto h-screen flex flex-col items-center transition-all ${screenshotMode ? 'bg-stone-100' : 'bg-stone-300'}`}>
        <div className="no-print w-full flex justify-between items-center p-3 bg-white/95 sticky top-0 z-40 shadow-sm px-8 border-b border-stone-200">
          <div className="flex gap-4">
            {!showEditor && !screenshotMode && <button onClick={() => setShowEditor(true)} className="bg-black text-white px-4 py-1.5 text-[11px] font-bold uppercase rounded shadow-md">Buka Editor</button>}
            <button onClick={toggleScreenshotMode} className={`px-5 py-1.5 text-[11px] font-bold uppercase rounded shadow-md transition-all ${screenshotMode ? 'bg-red-600 text-white' : 'bg-stone-800 text-white'}`}>
              {screenshotMode ? "Tutup Pratinjau" : "Mode Pratinjau Gambar"}
            </button>
          </div>
          <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">Status: Siap Cetak</span>
        </div>

        {/* INVOICE PREVIEW */}
        <div 
          className={`transition-all duration-300 flex flex-col items-center overflow-hidden bg-white ${screenshotMode ? 'my-0 shadow-none' : 'my-8 shadow-2xl'}`}
          style={{ width: '788px', height: '829px', minWidth: '788px', minHeight: '829px' }}
        >
          <div className="bg-white flex flex-col w-full h-full p-5 relative box-border">
            {/* BRANDING */}
            <div className="flex flex-col items-center text-center mb-2">
              <h1 className="text-[40px] font-black tracking-[0.25em] text-black mb-0 serif uppercase leading-none">{data.companyName}</h1>
              <p className="text-[11px] font-black tracking-[0.4em] text-black mb-1 uppercase border-b-2 border-black pb-1 leading-none">{data.parentCompany}</p>
              <p className="text-[8.5px] text-stone-500 max-w-[650px] leading-tight uppercase font-bold tracking-tight text-center">{data.headerAddress}</p>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="border-[1.8px] border-black p-3.5 flex-grow flex flex-col relative bg-white overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 flex flex-col">
                <div className="h-1/3 w-full bg-[#00522c]"></div>
                <div className="h-1/3 w-full bg-[#ae1f23]"></div>
                <div className="h-1/3 w-full bg-[#00522c]"></div>
              </div>

              <div className="text-center mt-3 mb-3">
                <h2 className="text-[24px] font-black tracking-[0.2em] uppercase leading-none text-black">FAKTUR TAGIHAN</h2>
                <p className="text-[10px] font-bold text-stone-600 mt-1 leading-none">Nomor Seri: {data.invoiceNumber}</p>
              </div>

              <div className="grid grid-cols-2 gap-6 text-[10px] mb-3">
                <div className="space-y-1">
                  <p className="font-black text-stone-400 uppercase text-[8px] leading-none mb-1 tracking-wider">Alamat Lengkap:</p>
                  <p className="font-black text-[13px] uppercase leading-none text-black">{data.customerName}</p>
                  <p className="text-stone-600 leading-tight uppercase text-[9.5px] mt-1 font-medium">{data.customerAddress}</p>
                  <div className="flex gap-4 mt-1">
                     {data.customerTelp && <span className="font-bold text-black uppercase text-[8.5px] tracking-tight">No Telp: {data.customerTelp}</span>}
                     {data.customerUp && <span className="font-bold text-black uppercase text-[8.5px] tracking-tight">Nama: {data.customerUp}</span>}
                  </div>
                </div>
                <div className="bg-stone-50 p-2.5 border border-stone-100 rounded-sm self-start">
                  <div className="grid grid-cols-[60px_1fr] gap-y-1.5 text-[9.5px]">
                    <span className="font-bold text-stone-400 uppercase text-[7.5px] tracking-wide">Code</span>
                    <span className="font-black uppercase leading-tight text-black">: {data.projectName}</span>
                    <span className="font-bold text-stone-400 uppercase text-[7.5px] tracking-wide">PERIODE</span>
                    <span className="font-black uppercase leading-tight text-black">: {data.projectPeriod}</span>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <table className="w-full border-collapse border-[1.5px] border-black text-[10.5px]">
                  <thead>
                    <tr className="border-b-[1.5px] border-black text-center font-black uppercase bg-stone-50 text-[7.5px] tracking-widest">
                      <td className="border-r-[1.5px] border-black py-2 w-[7%]">NO</td>
                      <td className="border-r-[1.5px] border-black py-2 text-left px-3">Keterangan</td>
                      <td className="border-r-[1.5px] border-black py-2 w-[10%]">FSE</td>
                      <td className="border-r-[1.5px] border-black py-2 w-[20%]">BIAYA</td>
                      <td className="py-2 w-[22%] text-right px-3">TOTAL (IDR)</td>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.slice(0, 5).map((item, idx) => {
                      const itemTotal = (item.quantity || 0) * (item.price || 0);
                      const isActuallyEmpty = !item.description && !item.quantity && !item.price;
                      
                      return (
                        <tr key={item.id} className="h-9 border-b border-stone-100 last:border-b-black">
                          <td className="border-r-[1.5px] border-black text-center text-[9.5px] font-medium">{idx + 1}</td>
                          <td className="border-r-[1.5px] border-black px-3 font-bold uppercase text-[9.5px] truncate">{item.description || (isActuallyEmpty ? '-' : '')}</td>
                          <td className="border-r-[1.5px] border-black text-center text-[9.5px] font-bold">{item.quantity > 0 ? item.quantity : (isActuallyEmpty ? '-' : '0')}</td>
                          <td className="border-r-[1.5px] border-black text-right px-3 text-[9.5px] font-bold">{item.price > 0 ? formatCurrency(item.price) : (isActuallyEmpty ? '-' : '0')}</td>
                          <td className="text-right px-3 font-black text-[10px]">{itemTotal > 0 ? formatCurrency(itemTotal) : (isActuallyEmpty ? '-' : '0')}</td>
                        </tr>
                      );
                    })}
                    {[...Array(Math.max(0, 4 - data.items.length))].map((_, i) => (
                      <tr key={`empty-${i}`} className="h-9 border-b border-stone-100 last:border-b-black">
                        <td className="border-r-[1.5px] border-black"></td><td className="border-r-[1.5px] border-black"></td><td className="border-r-[1.5px] border-black"></td><td className="border-r-[1.5px] border-black"></td><td></td>
                      </tr>
                    ))}
                    <tr className="font-black border-b border-black bg-stone-50 text-[11px]">
                      <td colSpan={4} className="border-r-[1.5px] border-black py-2 px-3 text-left uppercase tracking-[0.1em]">Total Tagihan</td>
                      <td className="text-right px-3 py-2 underline underline-offset-2 font-black text-[12px] text-black">{formatCurrency(totalBill)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-2">
                <div className="p-3 border border-stone-200 bg-stone-50/40 rounded-sm">
                  <p className="text-[8px] font-black uppercase tracking-widest text-stone-400 mb-2 border-b border-stone-200 pb-1">KETENTUAN PEMBAYARAN</p>
                  <div className="text-[9px] text-stone-800 whitespace-pre-wrap font-medium italic leading-relaxed">{data.notes}</div>
                </div>
                <div className="p-3 border border-stone-200 bg-white rounded-sm shadow-sm">
                  <p className="text-[8px] font-black uppercase tracking-widest text-stone-400 mb-2 border-b border-stone-100 pb-1">RINGKASAN AKHIR (OTOMATIS)</p>
                  <div className="space-y-2 text-[9.5px]">
                    <div className="flex justify-between items-center"><span className="text-stone-500 font-black text-[7.5px]">SUBTOTAL (JUMLAH ITEM)</span><span className="font-black">{formatCurrency(subtotal)}</span></div>
                    <div className="flex justify-between items-center"><span className="text-stone-500 font-black text-[7.5px]">DENDA/PINALTY</span><span className="font-black text-red-600">+{formatCurrency(data.penalty)}</span></div>
                    <div className="flex justify-between items-center border-t pt-1.5 mt-1.5"><span className="text-black font-black text-[8.5px]">TOTAL AKHIR</span><span className="font-black text-[13px] text-blue-800">{formatCurrency(totalBill)}</span></div>
                  </div>
                </div>
              </div>

              <div className="my-2 py-2 px-4 border border-stone-200 bg-stone-50/50 rounded-sm text-center">
                <p className="text-[11px] font-medium text-stone-500 italic tracking-tight uppercase">
                  {data.deadlineNotice}
                </p>
              </div>

              <div className="mt-auto flex justify-between items-end border-t border-stone-200 pt-2">
                 <div className="w-[310px]">
                    <div className="mb-1.5">
                      <p className="text-[9px] mb-1 font-black text-black">KODE TAGIHAN RESMI</p>
                      <p className="font-black text-[10px] bg-black text-white inline-block px-3 py-1 rounded-sm shadow-sm">{data.accountHolder}</p>
                    </div>
                    <div className="border-[1.5px] border-black p-2 bg-white shadow-lg">
                      <Barcode value={data.paymentAccount} />
                    </div>
                 </div>
                 <div className="w-[220px] text-center">
                    <p className="text-[9.5px] font-bold mb-1 uppercase text-stone-400">{data.date}</p>
                    <div className="h-20 w-full flex items-center justify-center">
                      <div className="w-52 h-20"><CustomSignature /></div>
                    </div>
                    <div className="w-full mt-1 border-t-[1.8px] border-black pt-1.5">
                       <p className="font-black text-[13px] uppercase text-black">{data.issuerName}</p>
                       <p className="text-[8px] uppercase font-black text-stone-400 mt-1">{data.issuerTitle}</p>
                    </div>
                 </div>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-1.5 flex flex-col">
                <div className="h-1/3 w-full bg-[#00522c]"></div>
                <div className="h-1/3 w-full bg-[#ae1f23]"></div>
                <div className="h-1/3 w-full bg-[#00522c]"></div>
              </div>
            </div>

            <div className="mt-2 text-[7.5px] text-stone-400 flex justify-between items-center px-1">
               <p>{data.copyrightText}</p>
               <p className="font-black uppercase text-black border-b border-black text-[8.5px]">{data.bottomLabel}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
