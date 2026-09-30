<html>
<head>
<!--#Include file="GlobalVariables.asp"-->
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title>Confirm Registry Registration</title>
<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="Style.css">
</head>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >
<!--#Include file="Header.asp"--> 

<%
TotalCount = 0
EventID = Request.Querystring("EventID")
PeopleID = Request.Querystring("PeopleID")

ShowHalterShow = False
ShowFleeceShow = False
ShowVendors = False
ShowSponsors = False
ShowClasses = False
 
dim  ItemTypeArray(10000)
dim  QTYArray(10000)
dim ItemArray(10000)
dim PriceArray(10000)
dim  VendorLevelIDArray(10000)
dim  VendorBoothQTYArray(1000)
dim VendorStallNameArray(1000)
dim  IDArray(1000)
dim ListCounter

ListCounter = 0
oldVendorLevelID = 0

sql4 = "select * from Vendor, vendorlevels where Vendor.VendorLevelID = vendorlevels.VendorLevelID and  Vendor.EventID = " & EventID & " and PeopleID = " & PeopleID & " order by Vendor.VendorLevelID "
'response.write("sql4=" & sql4)

Set rs4 = Server.CreateObject("ADODB.Recordset")
rs4.Open sql4, conn, 3, 3   
if not rs4.eof then
  VendorCounter = 0

while not rs4.eof  
ListCounter = ListCounter + 1
   newVendorLevelID = rs4("Vendor.VendorLevelID") 


'response.write("vendorname = " & ItemArray(VendorCounter) )
  'if oldVendorLevelID = newVendorLevelID then
   '  VendorBoothQTYArray(VendorCounter) = VendorBoothQTYArray(VendorCounter) + rs4("VendorBoothQTY")
  'else
    VendorCounter = VendorCounter + 1
	VendorLevelIDArray(VendorCounter) = rs4("Vendor.VendorLevelID")
	VendorBoothQTYArray(VendorCounter) =  rs4("VendorBoothQTY")
	VendorStallNameArray(ListCounter) =  rs4("VendorStallName")
	
	ItemArray(ListCounter) =  rs4("VendorStallName")
	ItemTypeArray(ListCounter) =  "Vendor"
	QTYArray(ListCounter) =   rs4("VendorBoothQTY")
	PriceArray(ListCounter) =  rs4("VendorStallPrice")
	IDArray(ListCounter) =  rs4("VendorID")
  'end if
  oldVendorLevelID = rs4("Vendor.VendorLevelID")
	rs4.movenext
wend
  TotalVendorCount = rs4.recordcount
  TotalCount = TotalCount + TotalVendorCount
 'response.write("<br>TotalVendorCount=" & TotalVendorCount )
end if

 
dim  SponsorshipLevelIDArray(10000)
dim  SponsorQTYArray(1000)
dim  SponsorshipLevelNameArray(1000)


oldsponsorshipLevelID = 0
sql4 = "select * from Sponsor, Sponsorshiplevels where Sponsor.SponsorshipLevelID = Sponsorshiplevels.SponsorshipLevelID and Sponsorshiplevels.EventID = " & EventID & " and PeopleID = " & PeopleID & " order by Sponsorshiplevels.SponsorshipLevelID "
'response.write("sql4=" & sql4)

Set rs4 = Server.CreateObject("ADODB.Recordset")
rs4.Open sql4, conn, 3, 3   
if not rs4.eof then
  sponsorCounter = 0

while not rs4.eof  
ListCounter = ListCounter + 1
   newsponsorshipLevelID = rs4("Sponsor.sponsorshipLevelID") 
'response.write("<br>oldsponsorshipLevelID=" &  oldsponsorshipLevelID )
'response.write("<br>newsponsorshipLevelID=" &  newsponsorshipLevelID )



 ' if oldsponsorshipLevelID = newsponsorshipLevelID then
    ' SponsorQTYArray(sponsorCounter) = SponsorQTYArray(sponsorCounter) + rs4("SponsorQTY")
  'else
    sponsorshipLevelIDCounter = sponsorshipLevelIDCounter + 1
  	sponsorCounter = SponsorCounter + 1
	SponsorshipLevelIDArray(sponsorCounter) = rs4("Sponsor.SponsorshipLevelID")
	SponsorQTYArray(sponsorCounter) =  rs4("SponsorQTY")
	SponsorshipLevelNameArray(sponsorCounter) =  rs4("SponsorshipLevelName")
	ItemTypeArray(ListCounter) =  "Sponsor"
	QTYArray(ListCounter) =   rs4("SponsorQTY")
	ItemArray(ListCounter) =  rs4("SponsorshipLevelName")
	PriceArray(ListCounter) =  rs4("SponsorshipLevelPrice")
	IDArray(ListCounter) =  rs4("SponsorID")



  'end if
  oldsponsorshipLevelID = rs4("Sponsor.sponsorshipLevelID")
	rs4.movenext
wend
  TotalSponsorCount = rs4.recordcount
  TotalCount = TotalCount + TotalSponsorCount

end if

%>
<h1>Verify your Order</h1>



<form  action="UpdateOrder.asp" method="post">
<table   border="1" bordercolor = "white" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" align = "center" valign = "top">
	<tr>
	  <td class = "body" bgcolor = "#C0C0C0" align = "center" width = "80">
			<b>Remove</b>
	  </td>
	  <td class = "body" bgcolor = "#C0C0C0" align = "center" width = "400">
			<b>Item</b>
	  </td>
	  	  <td class = "body" bgcolor = "#C0C0C0" align = "center" width = "80">
			<b>Item Price</b>
	  </td>

	  	  <td class = "body" bgcolor = "#C0C0C0" align = "center" width = "80">
			<b>Quantity</b>
	  </td>
	  	  
	  	  <td class = "body" bgcolor = "#C0C0C0" align = "right" width = "120">
			<b>Amount</b>
	  </td>
	 </tr>

<% 
x = 0
While x < TotalCount  

	x = x + 1

'ItemTypeArray(x)
odrdttmpQuantity = QTYArray(x)
'ItemArray(x)
'PriceArray(x)

Itemcost = PriceArray(x) *  QTYArray(x)
TotalCost = TotalCost + Itemcost

%>
<INPUT TYPE="hidden" NAME="ItemTypeArray(<%=x %>)" value = "<% = ItemTypeArray(x) %>">
<INPUT TYPE="hidden" NAME="ItemArray(<%=x %>)" value = "<% = ItemArray(x) %>">
<INPUT TYPE="hidden" NAME="IDArray(<%=x %>)" value = "<% = IDArray(x) %>">


<tr>
 		<td class = "body"  align = "center">
		<INPUT TYPE="checkbox" NAME="Remove(<%=x %>)" value = "Yes" >
	  </td>
	  <td class = "body2"  align = "left">
			<% =ItemArray(x) %>
	  </td>
	  	  <td class = "body2"  align = "right">
			<%= formatcurrency(PriceArray(x), 2) %><img src = "images/px.gif" width = "17" height = "1">
	  </td>

	  	  <td class = "body2"  align = "center">  <% If Itemcost = 0 Then %>
			<INPUT TYPE="Hidden" NAME="odrdttmpQuantity(<%=x %>)" value = "<% = odrdttmpQuantity %>" size = "2">
			1
		  <% Else %>
			<INPUT TYPE="text" NAME="odrdttmpQuantity(<%=x %>)" value = "<% = odrdttmpQuantity %>" size = "2">
			<% End If %>
	  </td>
	  	 
	  	  <td class = "body2"  align = "right">
		  <% If Itemcost = 0 Then %>
		      FREE
		<% Else %>
			<% = FormatCurrency(Itemcost,2) %><img src = "images/px.gif" width = "17" height = "1">

		<% End If %>
	  </td>
	   <td class = "body"  align = "right">
		  &nbsp;
	  </td>
</tr>
<% 

Wend 

%>
<INPUT TYPE="hidden" NAME="TotalCount" value = "<% = TotalCount %>" size = "2">
<tr>
	  <td class = "body2" bgcolor = "#C0C0C0"  colspan = "5" align = "right">
			<b>Total:</b>
	   
			<b><%=FormatCurrency(TotalCost,2) %></b><img src = "images/px.gif" width = "17" height = "1">

	  </td>
	 </tr>
	 <tr>
	  <td class = "body"   colspan = "4" align = "right">
			
	   </td>
	  	  <td class = "body"  align = "right">
			<input type=submit  value = "Update" border="0" name="Update">
	  </td>
	 </tr>
</table>
</form>
		
	


<% If TotalCost > 0 then %>
<table>
  <tr>
  <td class = "body"  width = "200" >
  &nbsp;
  </td>
  <td class = "body" bgcolor = "#E4BC42" width = "456"  valign = "top">
<h2><b><center>Complete Your Order</center></b></h2>
To complete your order via PayPal select the "Pay Now!" button.<br><br>
<b>Important!</b> After you make your payment <b>continue to the confirmation page (usually by selecting a link in Paypal titled "Return to Alpaca Infinity".)</b> <br><br>
  </td>
<td bgcolor = "#E4BC42"  valign = "top">
<% live = True
If live = True Then %>
<form target="_paypal" action="https://www.paypal.com/cgi-bin/webscr" method="post"> 
<% Else %>
<form target="_paypal" action="https://www.paypal.com/cgi-bin/webscr" method="post"> 
<% End If %>
<input type="hidden" name="cmd" value="_cart"> 
<input type="hidden" name="upload" value="1"> 

<input type="hidden" name="business" value="ContactUs@AlpacaInfinity.com">
<input type="hidden" name="first_name" value="<%=TempFirstName%>">
<input type="hidden" name="last_name" value="<%=TemplastName%>">
<input type="hidden" name="email" value="<%=EMail%>">
<input type="hidden" name="address1" value="<%=TempAddr1%>">
<input type="hidden" name="address2" value="<%=TempAddr2%>">
<input type="hidden" name="city" value="<%=TempCity%>">
<input type="hidden" name="state" value="<%=TempState%>">
<input type="hidden" name="country" value="<%=TempCountry%>">
<input type="hidden" name="zip" value="<%=TempZip%>">
<input type="hidden" name="night_phone_a" value="<%=TempPhone%>">
<input type="hidden" name="no_shipping" value="0">
<input type="hidden" name="no_note" value="1">
<input type="hidden" name="currency_code" value="USD">
<input type="hidden" name="lc" value="US">
<input type="hidden" name="bn" value="PP-ShopCartBF">
<input type="hidden" name="return" value="http://www.alpacainfinity.com/completion.asp">
<input type="hidden" name="cancel_return" value="http://www.alpacainfinity.com/FreeSignupstep2.asp?PID=<%=PID%>">


		<% 
x = -1
While x < TotalCount + 1

	x = x + 1


Itemcost = PriceArray(x) *  QTYArray(x)
TotalCost = TotalCost + Itemcost
'ItemTypeArray(x)
odrdttmpQuantity = QTYArray(x)
'ItemArray(x)
'PriceArray(x)


If Len(odrdttmpQuantity) < 1 Then
   odrdttmpQuantity = 1
End If 
Itemname = ItemArray(x)
Itemcost = PriceArray(x) *  odrdttmpQuantity

TotalCost = TotalCost + Itemcost
%>
<input type="hidden" name="item_name_<%=x%>" value="<%=ItemArray(x)%>"> 
<input type="hidden" name="amount_<%=x%>" value="<%=Itemcost %>"> 
<input type="hidden" name="quantity_<%=x%>" value="<%=odrdttmpQuantity  %>"> 

<br>

<% 
wend
%>
			
<input type=submit   border="1" name="submit"  Value = "  Pay Now! " class="btn" onmouseover="this.className='btn btnhov'" onmouseout="this.className='btn'"/>

</form>
</td>
				</tr>
			</table>	
<% Else 
If TotalCount = 0 Then %>
<table   border="0" bordercolor = "white" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "100%"    align = "center" valign = "top">
	<tr>
	  <td class = "body"  align = "center" width = "400" height = "200" valign = "top"><h2>You do not currently have anything ordered. </h2>
<a href = "signup.asp" class = "body">Click here to order something.</a>
	  </td>
	 </tr>
</table>		
<% Else 
'response.redirect("completion.asp")
 End If %>
<% End If %>
	
					

</body>

</html>
