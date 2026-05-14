import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useGetSettings } from "@workspace/api-client-react";

export function CartSidebar() {
  const { 
    items, removeItem, updateQty, clearCart, totalItems, isOpen, closeCart, buildWhatsAppMessage,
    isGift, setIsGift, recipientName, setRecipientName, giftMessage, setGiftMessage
  } = useCart();
  const { data: settings } = useGetSettings();

  const handleCheckout = () => {
    const url = buildWhatsAppMessage(
      settings?.whatsappNumber ?? "5511999999999",
      settings?.whatsappMessage ?? "Olá! Gostaria de fazer um pedido."
    );
    window.open(url, "_blank");
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-card border-l border-border shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <h2 className="font-serif text-xl font-bold text-foreground">Meu Carrinho</h2>
                <p className="text-xs text-muted-foreground">{totalItems} {totalItems === 1 ? "item" : "itens"}</p>
              </div>
              <button
                onClick={closeCart}
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all text-lg"
              >
                ×
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="text-5xl">🍫</div>
                  <p className="text-muted-foreground font-serif">Seu carrinho está vazio</p>
                  <p className="text-sm text-muted-foreground">Adicione docinhos e kits para montar seu pedido</p>
                </div>
              ) : (
                items.map(item => (
                  <motion.div
                    key={`${item.type}-${item.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-3 bg-muted/30 rounded-2xl p-3 border border-border"
                  >
                    {item.imageUrl && (
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                        {item.imageUrl.match(/\.(mp4|mov|webm)$/i) ? (
                          <video src={item.imageUrl} className="w-full h-full object-cover" muted />
                        ) : (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">{item.name}</p>
                      {item.price && <p className="text-primary text-xs font-medium">{item.price}</p>}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQty(item.id, item.type, item.quantity - 1)}
                          className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all text-sm font-bold"
                        >
                          -
                        </button>
                        <span className="text-sm font-semibold text-foreground w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.id, item.type, item.quantity + 1)}
                          className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all text-sm font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id, item.type)}
                      className="text-muted-foreground hover:text-destructive transition-colors text-lg flex-shrink-0 self-start"
                    >
                      ×
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t border-border space-y-4">
                {/* Gift Option */}
                <div className="bg-primary/5 rounded-2xl p-4 border border-primary/20">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={isGift}
                        onChange={(e) => setIsGift(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-6 bg-muted rounded-full peer peer-checked:bg-primary transition-all"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-4"></div>
                    </div>
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                      🎁 Enviar como presente?
                    </span>
                  </label>

                  <AnimatePresence>
                    {isGift && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 space-y-3">
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1 ml-1">Para quem é o presente?</label>
                            <input 
                              type="text"
                              value={recipientName}
                              onChange={(e) => setRecipientName(e.target.value)}
                              placeholder="Nome do presenteado"
                              className="w-full px-3 py-2 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1 ml-1">Mensagem de carinho</label>
                            <textarea 
                              value={giftMessage}
                              onChange={(e) => setGiftMessage(e.target.value)}
                              placeholder="Escreva uma mensagem especial..."
                              rows={2}
                              className="w-full px-3 py-2 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={clearCart}
                  className="w-full text-xs text-muted-foreground hover:text-destructive transition-colors text-center"
                >
                  Limpar carrinho
                </button>
                <motion.button
                  onClick={handleCheckout}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-2xl bg-green-500 text-white font-bold text-base shadow-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Finalizar pelo WhatsApp
                </motion.button>
                <p className="text-xs text-muted-foreground text-center">A mensagem com seu pedido já virá pronta!</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
