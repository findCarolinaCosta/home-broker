package entity

type Investor struct {
	ID   string
	Name string

	AssetPotion []*InvestorAssetPosition
}

func NewInvestor(id string) *Investor {
	return &Investor{
		ID:          id,
		AssetPotion: []*InvestorAssetPosition{},
	}
}

func (i *Investor) AddAssetPosition(assetPotion *InvestorAssetPosition) {
	i.AssetPotion = append(i.AssetPotion, assetPotion)
}

func (i *Investor) UpdateAssetPotion(assetID string, qtdShares int) {
	assetPosition := i.GetAssetPotion(assetID)
	if assetPosition == nil {
		i.AssetPotion = append(i.AssetPotion, NewInvestorAssetPosition(assetID, qtdShares))
	} else {
		assetPosition.Shares += qtdShares
	}
}

func (i *Investor) GetAssetPotion(assetID string) *InvestorAssetPosition {
	for _, assetPosition := range i.AssetPotion {
		if assetPosition.AssetID == assetID {
			return assetPosition
		}
	}
	return nil
}

type InvestorAssetPosition struct {
	AssetID string
	Shares  int
}

func NewInvestorAssetPosition(assetID string, shares int) *InvestorAssetPosition {
	return &InvestorAssetPosition{
		AssetID: assetID,
		Shares:  shares,
	}
}
