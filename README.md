# XRPL Check Usage Demo

#Create Ticket
Usage: node dist/ticketCreate [source FamilySeed]

#Create Check
Usage: node dist/checkCreate [source FamilySeed] [destination: r-address] [XRP amount] [ticket sequence no]

#Create check with ticket sequence number
Usage: node dist/checkCreateWithTicket [source FamilySeed] [destination: r-address] [XRP amount] [ticket sequence no]

#Cash Check
Usage: node dist/checkCash [check recipient's FamilySeed] [CheckId] [cash amount]

#Get Account Detail
Usage: node dist/getAccountDetail [FamilySeed]

#XRP payment
Usage: node dist/payment [FamilySeed] [destinationAddr] XRP

# Testing Procedure

This project is made for testing the concept of sending check with ticket sequence. Do the following to test the concept

execute: node dist/ticketcreate s#########(Family seed of the check creator)
upon successful execution, it should return a new sequence number as follows:
new sequence number = 38486563

then execute: node dist/checkCreateWithTicket s#########s#########(Family seed of the check creator) r#####(r-address of check recipient) 1(arp amount for the check) 38486561 (the new ticket sequence number )
