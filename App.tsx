
import React, { useState, useRef } from 'react';
import { InvoiceItem } from './types';

declare const htmlToImage: any;

const CustomSignature: React.FC = () => (
  <div className="relative flex flex-col items-center">
    <svg viewBox="0 0 300 150" className="w-56 h-24 -mb-2" preserveAspectRatio="xMidYMid meet">
      <path 
        d="M60,85 C45,65 55,40 75,35 C90,30 100,55 95,85 C90,120 75,135 65,115 C55,95 70,60 110,65 C130,68 120,95 130,95 C140,95 145,80 155,55 C165,30 175,45 170,85 C165,125 155,135 150,110 C145,85 160,50 190,55 C210,60 205,85 215,85 C225,85 235,65 245,40 M140,85 L160,80 M180,75 C200,65 220,60 250,55" 
        fill="none" 
        stroke="#000000" 
        strokeWidth="1.5" 
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path 
        d="M80,110 Q150,95 240,65"
        fill="none"
        stroke="#000000"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  </div>
);

const Barcode: React.FC<{ value: string }> = ({ value }) => (
  <div className="flex flex-col items-center w-full bg-white px-2 py-1">
    <div className="flex items-end h-8 w-full justify-center overflow-hidden gap-[1.5px]">
      {[...Array(38)].map((_, i) => (
        <div 
          key={i} 
          className="bg-black h-full shrink-0" 
          style={{ 
            width: i % 3 === 0 ? '3px' : i % 5 === 0 ? '1px' : '2px', 
            opacity: i % 10 === 0 ? 0 : 1
          }} 
        />
      ))}
    </div>
    <div className="mt-1 text-[8px] font-black tracking-[0.4em] text-black text-center">
      {value}
    </div>
  </div>
);

const App: React.FC = () => {
  const [showEditor, setShowEditor] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);
  
  const [data, setData] = useState({
    brandName: 'GUCCI',
    parentCompany: 'PT GRAHA CITRA PRIMA',
    headerAddress: 'PLAZA INDONESIA, LEVEL 1, UNIT 46 - 47, JL. M.H. THAMRIN NO.30 KAV 28, JAKARTA, 10350, INDONESIA RR4C+PJ GONDANGDIA, KOTA JAKARTA PUSAT, DAERAH KHUSUS IBUKOTA JAKARTA, INDONESIA',
    invoiceTitle: 'FAKTUR TAGIHAN',
    invoiceNumber: '0522/INA26/I/2026',
    date: '13 JANUARI 2026',
    customerName: 'DELIANA COLLECTION',
    customerAddress: 'PONDOK AREN INDAH/ ARINDA PERMAI 2 JL. MAHONI I BLOK E 5 NO. 1 PONDOK AREN',
    customerTelp: '6221733168',
    customerUp: 'IBU DELIANA',
    projectName: 'INACRAFT 2026',
    projectPeriod: '04 FEBRUARI 2026 S/D 08 FEBRUARI 2026',
    specialNote: 'BATAS WAKTU PENYELESAIAN PEMBAYARAN ADALAH 1×24 JAM SEJAK LAMPIRAN INVOICE DITERIMA',
    items: [
      { id: '1', description: 'MAIN LOBBY NO.97', quantity: 1, size: '', price: 1000000 },
      { id: '2', description: 'BIAYA KEPESERTAAN PADA PAMERAN INACRAFT 2026', quantity: 1, size: '', price: 1000000 },
      { id: '3', description: 'BIAYA TAMBAHAN FASILITAS', quantity: 1, size: '', price: 1000000 },
      { id: '4', description: '-', quantity: 0, size: '', price: 0 },
    ] as InvoiceItem[],
    penalty: 500000,
    paymentAccount: '7514 1715 6279 4985',
    accountHolder: 'PT GRAHA CITRA PRIMA',
    issuerName: 'NATALIA OLYVIA WIJAYA',
    issuerTitle: 'CHIEF FINANCIAL OFFICER (CFO)',
    keterangan: `1. Tahap II (100%) Pembayaran Paling Lambat 5 Januari 2026.\n2. Pembayaran dianggap sah bila dana telah efektif di rekening kami.\n3. Mohon cantumkan nomor invoice saat melakukan transfer dana.\n4. Konfirmasi pembayaran dapat dikirimkan melalui email resmi kami.`
  });

  const handleScreenshot = async () => {
    if (!invoiceRef.current) return;
    try {
      setIsCapturing(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      const dataUrl = await htmlToImage.toPng(invoiceRef.current, {
        width: 730,
        height: 1080,
      });
      const link = document.createElement('a');
      link.download = `${data.brandName}-INV-${data.invoiceNumber.replace(/\//g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsCapturing(false);
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setData({
      ...data,
      items: data.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    });
  };

  const formatCurrency = (num: number) => new Intl.NumberFormat('id-ID').format(num);
  const subtotal = data.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  const total = subtotal + data.penalty;

  return (
    <div className="min-h-screen flex bg-stone-200 font-['Roboto'] font-medium overflow-hidden">
      {/* SIDEBAR EDITOR */}
      <div className={`no-print bg-[#111] text-white h-screen sticky top-0 transition-all overflow-y-auto z-50 ${showEditor ? 'w-96 p-6 shadow-2xl border-r border-stone-800' : 'w-0 p-0 overflow-hidden'}`}>
        <div className="flex justify-between items-center mb-6 border-b border-stone-800 pb-2">
          <h2 className="text-[10px] font-black tracking-widest uppercase text-red-600">GUCCI CONFIG</h2>
          <button onClick={() => setShowEditor(false)} className="hover:text-red-500 text-xl">✕</button>
        </div>
        
        <button onClick={handleScreenshot} disabled={isCapturing} className="w-full bg-red-700 py-3 rounded text-[10px] font-black uppercase tracking-widest mb-6 hover:bg-red-600 transition-colors shadow-lg active:scale-95 transform">
          {isCapturing ? 'DOWNLOADING...' : 'DOWNLOAD 730x1080 PNG'}
        </button>

        <div className="space-y-6 pb-20">
          <div className="space-y-3">
            <h3 className="text-[9px] font-black text-red-500 uppercase tracking-tighter border-b border-stone-800 pb-1 text-center">Header & Brand</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[8px] text-stone-500 font-bold uppercase block mb-1">Brand Name</label>
                <input className="w-full bg-stone-900 border border-stone-800 p-2 text-xs outline-none focus:border-red-700" value={data.brandName} onChange={e => setData({...data, brandName: e.target.value})} />
              </div>
              <div>
                <label className="text-[8px] text-stone-500 font-bold uppercase block mb-1">Doc Title</label>
                <input className="w-full bg-stone-900 border border-stone-800 p-2 text-xs outline-none focus:border-red-700" value={data.invoiceTitle} onChange={e => setData({...data, invoiceTitle: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="text-[8px] text-stone-500 font-bold uppercase block mb-1">Invoice Number</label>
              <input className="w-full bg-stone-900 border border-stone-800 p-2 text-xs outline-none focus:border-red-700" value={data.invoiceNumber} onChange={e => setData({...data, invoiceNumber: e.target.value})} />
            </div>
            <div>
              <label className="text-[8px] text-stone-500 font-bold uppercase block mb-1">Header Address</label>
              <textarea className="w-full bg-stone-900 border border-stone-800 p-2 text-xs outline-none h-16 resize-none focus:border-red-700" value={data.headerAddress} onChange={e => setData({...data, headerAddress: e.target.value})} />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[9px] font-black text-red-500 uppercase tracking-tighter border-b border-stone-800 pb-1 text-center">Customer & Contacts</h3>
            <div>
              <label className="text-[8px] text-stone-500 font-bold uppercase block mb-1">Customer Name</label>
              <input className="w-full bg-stone-900 border border-stone-800 p-2 text-xs outline-none focus:border-red-700" value={data.customerName} onChange={e => setData({...data, customerName: e.target.value})} />
            </div>
            <div>
              <label className="text-[8px] text-stone-500 font-bold uppercase block mb-1">Customer Address</label>
              <textarea className="w-full bg-stone-900 border border-stone-800 p-2 text-xs outline-none h-16 resize-none focus:border-red-700" value={data.customerAddress} onChange={e => setData({...data, customerAddress: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[8px] text-stone-500 font-bold uppercase block mb-1">NO TELP</label>
                <input className="w-full bg-stone-900 border border-stone-800 p-2 text-xs outline-none focus:border-red-700" value={data.customerTelp} onChange={e => setData({...data, customerTelp: e.target.value})} />
              </div>
              <div>
                <label className="text-[8px] text-stone-500 font-bold uppercase block mb-1">U.P (NAMA)</label>
                <input className="w-full bg-stone-900 border border-stone-800 p-2 text-xs outline-none focus:border-red-700" value={data.customerUp} onChange={e => setData({...data, customerUp: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[9px] font-black text-red-500 uppercase tracking-tighter border-b border-stone-800 pb-1 text-center">Project Details</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[8px] text-stone-500 font-bold uppercase block mb-1">Project Code</label>
                <input className="w-full bg-stone-900 border border-stone-800 p-2 text-xs outline-none focus:border-red-700" value={data.projectName} onChange={e => setData({...data, projectName: e.target.value})} />
              </div>
              <div>
                <label className="text-[8px] text-stone-500 font-bold uppercase block mb-1">Period</label>
                <input className="w-full bg-stone-900 border border-stone-800 p-2 text-xs outline-none focus:border-red-700" value={data.projectPeriod} onChange={e => setData({...data, projectPeriod: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="text-[8px] text-stone-500 font-bold uppercase block mb-1">Invoice Date</label>
              <input className="w-full bg-stone-900 border border-stone-800 p-2 text-xs outline-none focus:border-red-700" value={data.date} onChange={e => setData({...data, date: e.target.value})} />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[9px] font-black text-red-500 uppercase tracking-tighter border-b border-stone-800 pb-1 text-center">Pricing & Table</h3>
            {data.items.map((item, idx) => (
              <div key={item.id} className="p-2 bg-stone-900 rounded border border-stone-800 space-y-2">
                <input className="w-full bg-stone-800 p-1 text-[10px] outline-none focus:border-red-700 border border-transparent" value={item.description} placeholder="Description" onChange={e => updateItem(item.id, 'description', e.target.value)} />
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" className="w-full bg-stone-800 p-1 text-[10px] outline-none focus:border-red-700 border border-transparent" value={item.quantity} placeholder="Qty" onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)} />
                  <input type="number" className="w-full bg-stone-800 p-1 text-[10px] outline-none focus:border-red-700 border border-transparent" value={item.price} placeholder="Price" onChange={e => updateItem(item.id, 'price', parseInt(e.target.value) || 0)} />
                </div>
              </div>
            ))}
            <div>
              <label className="text-[8px] text-stone-500 font-bold uppercase block mb-1">Penalty Fee (IDR)</label>
              <input type="number" className="w-full bg-stone-900 border border-stone-800 p-2 text-xs outline-none focus:border-red-700" value={data.penalty} onChange={e => setData({...data, penalty: parseInt(e.target.value) || 0})} />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[9px] font-black text-red-500 uppercase tracking-tighter border-b border-stone-800 pb-1 text-center">Authority & Footer</h3>
            <div>
              <label className="text-[8px] text-stone-500 font-bold uppercase block mb-1">Signatory Name</label>
              <input className="w-full bg-stone-900 border border-stone-800 p-2 text-xs outline-none focus:border-red-700" value={data.issuerName} onChange={e => setData({...data, issuerName: e.target.value})} />
            </div>
            <div>
              <label className="text-[8px] text-stone-500 font-bold uppercase block mb-1">Signatory Title</label>
              <input className="w-full bg-stone-900 border border-stone-800 p-2 text-xs outline-none focus:border-red-700" value={data.issuerTitle} onChange={e => setData({...data, issuerTitle: e.target.value})} />
            </div>
            <div>
              <label className="text-[8px] text-stone-500 font-bold uppercase block mb-1">KETERANGAN (NOTES)</label>
              <textarea className="w-full bg-stone-900 border border-stone-800 p-2 text-xs outline-none h-24 resize-none focus:border-red-700" value={data.keterangan} onChange={e => setData({...data, keterangan: e.target.value})} />
            </div>
            <div>
              <label className="text-[8px] text-stone-500 font-bold uppercase block mb-1">Special Note Box</label>
              <textarea className="w-full bg-stone-900 border border-stone-800 p-2 text-xs outline-none h-20 resize-none focus:border-red-700" value={data.specialNote} onChange={e => setData({...data, specialNote: e.target.value})} />
            </div>
          </div>
        </div>
      </div>

      {/* INVOICE PREVIEW */}
      <div className="flex-1 flex flex-col items-center p-4 overflow-auto bg-stone-300">
        {!showEditor && (
          <button onClick={() => setShowEditor(true)} className="no-print mb-4 bg-black text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl hover:bg-stone-800 transition-all active:scale-95">Open Settings</button>
        )}

        <div 
          ref={invoiceRef}
          style={{ width: '730px', height: '1080px', boxSizing: 'border-box' }}
          className="bg-white relative flex flex-col p-8 shadow-2xl select-none"
        >
          {/* LOGO & ADDRESS */}
          <div className="flex flex-col items-center mb-5 pt-2">
            <h1 className="text-[48px] font-black tracking-[0.2em] text-black leading-none" style={{ fontWeight: 900 }}>{data.brandName}</h1>
            <p className="text-[12px] font-black tracking-[0.4em] text-black uppercase -mt-0.5">{data.parentCompany}</p>
            <p className="text-[8px] text-stone-500 text-center max-w-[500px] mt-2 uppercase font-bold leading-tight tracking-tight">
              {data.headerAddress}
            </p>
          </div>

          {/* MAIN CONTAINER */}
          <div className="border border-stone-300 flex-1 flex flex-col relative p-5 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2.5px] flex">
              <div className="flex-1 bg-[#1d4d2f]"></div>
              <div className="flex-1 bg-[#ae1f23]"></div>
              <div className="flex-1 bg-[#1d4d2f]"></div>
            </div>

            <div className="text-center mt-4 mb-6">
              <h2 className="text-[28px] font-black tracking-[0.15em] uppercase text-black" style={{ fontWeight: 900 }}>{data.invoiceTitle}</h2>
              <p className="text-[9px] font-black text-stone-400 mt-1 uppercase tracking-[0.2em]">NOMOR SERI: {data.invoiceNumber}</p>
            </div>

            <div className="grid grid-cols-[1fr_210px] gap-6 mb-5">
              <div className="space-y-1">
                <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest">ALAMAT LENGKAP:</p>
                <p className="text-[14px] font-black uppercase text-black leading-none mb-1">{data.customerName}</p>
                <p className="text-[8.5px] text-stone-600 font-medium uppercase leading-snug max-w-[320px]">{data.customerAddress}</p>
                <div className="flex gap-4 pt-1">
                  <p className="text-[9px] font-black uppercase text-black">NO TELP: {data.customerTelp}</p>
                  <p className="text-[9px] font-black uppercase text-black">NAMA: {data.customerUp}</p>
                </div>
              </div>
              <div className="bg-[#fcfcfc] border border-stone-200 p-3 flex flex-col justify-center gap-1.5">
                <div className="grid grid-cols-[50px_1fr] text-[8.5px] font-black">
                  <span className="text-stone-400 uppercase">CODE</span>
                  <span className="text-black uppercase">: {data.projectName}</span>
                </div>
                <div className="grid grid-cols-[50px_1fr] text-[8.5px] font-black">
                  <span className="text-stone-400 uppercase">PERIODE</span>
                  <span className="text-black uppercase leading-tight">: {data.projectPeriod}</span>
                </div>
              </div>
            </div>

            <div className="flex-grow">
              <table className="w-full border-collapse border border-black">
                <thead>
                  <tr className="bg-[#f8f8f8] text-[9px] font-black uppercase border-b border-black h-10">
                    <th className="border-r border-black w-10 text-center">NO</th>
                    <th className="border-r border-black px-4 text-left">KETERANGAN</th>
                    <th className="border-r border-black w-14 text-center">FSE</th>
                    <th className="border-r border-black w-24 text-center">BIAYA</th>
                    <th className="w-28 text-center">TOTAL (IDR)</th>
                  </tr>
                </thead>
                <tbody className="text-[10px] font-medium uppercase">
                  {data.items.map((item, idx) => (
                    <tr key={item.id} className="border-b border-stone-200 h-10">
                      <td className="border-r border-black text-center text-stone-400">{idx + 1}</td>
                      <td className="border-r border-black px-4 text-black font-black truncate max-w-[200px]">{item.description}</td>
                      <td className="border-r border-black text-center">{item.quantity || '-'}</td>
                      <td className="border-r border-black text-center">{formatCurrency(item.price)}</td>
                      <td className="text-center font-black">{item.quantity ? formatCurrency(item.quantity * item.price) : '-'}</td>
                    </tr>
                  ))}
                  <tr className="h-10 bg-stone-50 border-t border-black">
                    <td colSpan={4} className="px-4 text-[10px] font-black border-r border-black tracking-widest">TOTAL TAGIHAN</td>
                    <td className="text-center text-[12px] font-black underline underline-offset-4 decoration-2">{formatCurrency(total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-[1fr_240px] gap-8 mt-6">
              <div className="space-y-3">
                <p className="text-[8px] font-black text-stone-400 uppercase border-b border-stone-100 pb-0.5 tracking-tight">KETENTUAN PEMBAYARAN</p>
                <p className="text-[9px] font-black italic uppercase text-black">KETERANGAN:</p>
                <div className="text-[9px] font-medium text-stone-600 space-y-1 leading-tight italic whitespace-pre-line max-h-32 overflow-hidden">
                  {data.keterangan}
                </div>
              </div>
              <div className="bg-[#fcfcfc] border border-stone-200 p-4 space-y-3 shadow-sm">
                <p className="text-[8px] font-black text-stone-400 uppercase border-b border-stone-200 pb-0.5">RINGKASAN AKHIR (OTOMATIS)</p>
                <div className="flex justify-between text-[10px] font-medium">
                  <span className="text-stone-500 uppercase tracking-tighter">SUBTOTAL</span>
                  <span className="text-black font-black">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black text-red-700">
                  <span className="tracking-tighter uppercase">DENDA/PINALTY</span>
                  <span>+{formatCurrency(data.penalty)}</span>
                </div>
                <div className="border-t border-black pt-2 flex justify-between items-end">
                  <span className="text-[10px] font-black tracking-tighter">TOTAL AKHIR</span>
                  <span className="text-[18px] font-black italic underline decoration-2">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 border border-stone-200 p-3 bg-white relative">
               <div className="absolute top-0 left-0 w-1.5 h-full bg-red-800"></div>
               <p className="text-[11px] font-black italic uppercase text-center leading-tight tracking-tight px-4 whitespace-pre-line">
                " {data.specialNote} "
               </p>
            </div>

            <div className="mt-auto flex justify-between items-end pb-1 overflow-hidden">
              <div className="space-y-2">
                <p className="text-[8px] font-black text-stone-400 uppercase tracking-tighter">KODE TAGIHAN RESMI</p>
                <div className="bg-black text-white px-4 py-1.5 text-[12px] font-black uppercase inline-block">
                  {data.parentCompany}
                </div>
                <div className="w-56 border border-stone-200 overflow-hidden">
                  <Barcode value={data.paymentAccount} />
                </div>
              </div>

              <div className="text-center w-60 flex flex-col items-center">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">{data.date}</p>
                <div className="flex items-center justify-center">
                  <CustomSignature />
                </div>
                <div className="w-full border-t border-black pt-1">
                  <p className="text-[14px] font-black uppercase leading-none">{data.issuerName}</p>
                  <p className="text-[9px] font-bold text-stone-400 uppercase tracking-tighter">{data.issuerTitle}</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-[2.5px] flex">
              <div className="flex-1 bg-[#1d4d2f]"></div>
              <div className="flex-1 bg-[#ae1f23]"></div>
              <div className="flex-1 bg-[#1d4d2f]"></div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 text-[8px] font-bold text-stone-400 uppercase px-1 tracking-tight">
            <p>© 2016 - 2025 {data.brandName.toUpperCase()} S.P.A. - ALL RIGHTS RESERVED. SIAE LICENCE # 2294/I/1936</p>
            <p className="text-black border-b-2 border-black tracking-[0.15em] text-[10px] font-black">DOKUMEN OTENTIK</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
