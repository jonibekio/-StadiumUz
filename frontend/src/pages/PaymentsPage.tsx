import { useState, useEffect } from 'react'
import UserLayout from '../components/layout/UserLayout'
import { paymentService, Payment } from '../services/payment'

const methodLabels: Record<string, string> = {
  CASH: 'Naqd',
  CARD: 'Plastik karta',
  CLICK: 'Click',
  PAYME: 'Payme',
  UZUM: 'Uzum Bank',
}

const statusLabels: Record<string, string> = {
  PENDING: 'Kutilmoqda',
  COMPLETED: "To'langan",
  FAILED: 'Xatolik',
  REFUNDED: 'Qaytarilgan',
}

const statusColors: Record<string, string> = {
  PENDING: 'text-tertiary-fixed-dim',
  COMPLETED: 'text-primary-fixed-dim',
  FAILED: 'text-error',
  REFUNDED: 'text-secondary',
}

const methodIcons: Record<string, string> = {
  CASH: 'payments',
  CARD: 'credit_card',
  CLICK: 'smartphone',
  PAYME: 'smart_display',
  UZUM: 'account_balance',
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    paymentService.list()
      .then(setPayments)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const totalPaid = payments
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + Number(p.amount), 0)

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-text-primary mb-2">To'lovlar</h1>
          <p className="font-body-md text-on-surface-variant">To'lov tarixingiz</p>
        </div>

        {/* Summary Card */}
        <div className="ghost-border rounded-xl bg-surface-container-low p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">Jami to'langan</p>
              <p className="font-display-lg text-headline-lg text-primary mt-1">{totalPaid.toLocaleString()} so'm</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-3xl">account_balance_wallet</span>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {!loading && payments.length === 0 && (
          <div className="text-center py-16 ghost-border rounded-xl bg-surface-container-low">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">receipt_long</span>
            <h3 className="font-headline-md text-headline-md text-text-primary mb-2">To'lovlar topilmadi</h3>
            <p className="text-on-surface-variant">Hali birorta to'lov amalga oshirilmagan</p>
          </div>
        )}

        {!loading && payments.length > 0 && (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="ghost-border rounded-xl bg-surface-container-low p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant">{methodIcons[payment.method] || 'payment'}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-text-primary font-body-md font-semibold">{methodLabels[payment.method] || payment.method}</span>
                    <span className={`text-[12px] font-label-caps ${statusColors[payment.status]}`}>{statusLabels[payment.status]}</span>
                  </div>
                  <p className="text-on-surface-variant text-body-sm">
                    ID: {payment.transaction_id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-headline-md text-headline-md text-primary">{Number(payment.amount).toLocaleString()} so'm</p>
                  <p className="text-on-surface-variant text-[12px] font-label-caps">
                    {new Date(payment.created_at).toLocaleDateString('uz-UZ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  )
}
