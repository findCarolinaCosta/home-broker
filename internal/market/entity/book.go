package entity

import (
	"container/heap"
	"sync"
)

type Book struct {
	Order        []*Order
	Transactions []*Transaction
	OrderChan    chan *Order //input
	OrderChanOut chan *Order
	Wg           *sync.WaitGroup
}

func NewBook(orderChan chan *Order, orderChanOut chan *Order, wg *sync.WaitGroup) *Book {
	return &Book{
		Order:        []*Order{},
		Transactions: []*Transaction{},
		OrderChan:    orderChan,
		OrderChanOut: orderChanOut,
		Wg:           wg,
	}
}

func (b *Book) Trade() {
	buyOrders := NewOrderQueue()
	sellOrders := NewOrderQueue()

	heap.Init(buyOrders)
	heap.Init(sellOrders)

	for order := range b.OrderChan {
		if order.OrderType == "BUY" {
			buyOrders.Push(order)
			if sellOrders.Len() > 0 && sellOrders.Orders[0].Price <= order.Price {
				sellOrder := sellOrders.Pop().(*Order)
				if sellOrder.PendingShares > 0 {
					transactions := NewTransaction(sellOrder, order, order.Shares, sellOrder.Price)

					b.AddTransaction(transactions, b.Wg)
					sellOrder.Transactions = append(sellOrder.Transactions, transactions)
					order.Transactions = append(order.Transactions, transactions)

					b.OrderChanOut <- sellOrder
					b.OrderChanOut <- order

					if sellOrder.PendingShares > 0 {
						sellOrders.Push(sellOrder)
					}
				}
			}
		} else if order.OrderType == "SELL" {
			sellOrders.Push(order)
			if buyOrders.Len() > 0 && buyOrders.Orders[0].Price >= order.Price {
				buyOrder := buyOrders.Pop().(*Order)
				if buyOrder.PendingShares > 0 {
					transactions := NewTransaction(buyOrder, order, order.Shares, buyOrder.Price)

					b.AddTransaction(transactions, b.Wg)
					buyOrder.Transactions = append(buyOrder.Transactions, transactions)
					order.Transactions = append(order.Transactions, transactions)

					b.OrderChanOut <- buyOrder
					b.OrderChanOut <- order

					if buyOrder.PendingShares > 0 {
						sellOrders.Push(buyOrder)
					}
				}
			}
		}
	}
}

func (b *Book) AddTransaction(transaction *Transaction, wg *sync.WaitGroup) {
	defer wg.Done()

	sellingShares := transaction.SellingOrder.PendingShares
	buyingShares := transaction.BuyingOrder.PendingShares

	minShares := sellingShares
	if buyingShares < minShares {
		minShares = buyingShares
	}

	transaction.SellingOrder.Investor.UpdateAssetPosition(transaction.SellingOrder.Asset.ID, -minShares)
	transaction.SellingOrder.PendingShares -= minShares

	transaction.BuyingOrder.Investor.UpdateAssetPosition(transaction.SellingOrder.Asset.ID, minShares)
	transaction.BuyingOrder.PendingShares -= minShares

	transaction.Total = float64(transaction.Shares) * transaction.BuyingOrder.Price

	if transaction.BuyingOrder.PendingShares == 0 {
		transaction.BuyingOrder.Status = "CLOSED"
	}

	if transaction.SellingOrder.PendingShares == 0 {
		transaction.SellingOrder.Status = "CLOSED"
	}

	b.Transactions = append(b.Transactions, transaction)
}
