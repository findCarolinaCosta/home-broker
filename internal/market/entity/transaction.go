package entity

import (
	"time"

	"github.com/google/uuid"
)

type Transactions struct {
	ID           string
	SellingOrder *Order
	BuyingOrder  *Order
	Shares       int
	Price        float64
	Total        float64
	DateTime     time.Time
}

func NewTransactions(sellingOrder *Order, buyingOrder *Order, shares int, price float64) *Transactions {
	total := float64(shares) * price

	return &Transactions{
		ID:           uuid.New().String(),
		SellingOrder: sellingOrder,
		BuyingOrder:  buyingOrder,
		Shares:       shares,
		Price:        price,
		Total:        total,
		DateTime:     time.Now(),
	}
}
