# XRPL Check Usage Demo

#Create Ticket
Usage: node dist/ticketCreate <source FamilySeed>

#Create Check
Usage: node dist/checkCreate <source FamilySeed> <destination: r-address> <XRP amount> [sequence no]

#Cash Check
Usage: node dist/checkCash <check recipient's FamilySeed> <CheckId> [cash amount]

#Get Account Detail
Usage: node dist/getAccountDetail <FamilySeed>

#XRP payment
Usage: node dist/payment <FamilySeed> <destinationAddr> XRP
