<br>
<table  border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"    valign = "top" width = "280">
 <tr>
<td class = "body" colspan = "2" height = "25" valign = "top">
	<big><b><%=Trim(rsA("ProdName"))%></b></big>
</td>
<tr>
<tr>
<td class= "body"  valign = "top"  width = "180">
		<% If Len(rsA("ProdPrice")) > 1 Then %>
				Price: <b><%=FormatCurrency(rsA("Prodprice"))%></b><br>
		<% end if %>
										
<% Prodweight = rsA("ProdWeight")
		if Prodweight > 0 Then
			ShippingCost = valBaseRate + (Prodweight-1) * valAddedRate
		Else
			ShippingCost =valdefaultRate
		End If %>
	
<% if len(rsA("Materials")) > 2 then%>
		<%=rsA("Materials")%><br><br>
<% end if %>
										
<% ProdQuantityAvailable = rsA("ProdQuantityAvailable")
		If Len(ProdQuantityAvailable) > 1  Then %>
				Quantity Available: <%=ProdQuantityAvailable%><br>
		<% End If	%>
			<% ProdSize = rsA("ProdSize")
			If Len(ProdSize) > 1  Then %>
				Size: <%=ProdSize%><br>
			<% End If	%>
</td>
</tr>
<tr>
<td class = "body" >
	<%=Description %><br><br>
</td>
</tr>
<tr>
<td class = "body" >
	<% ProdSellStore = rsA("ProdSellStore")
			ProdCustID = rsA("CustID")
		If ProdSellStore = false  Then %>
			<br>Please contact the seller for more information.<br>
<% 
	conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
	"Data Source=" & server.mappath(DatabasePath) & ";" & _
	"User Id=;Password=;" '& _ 
	sql = "select * from sfCustomers where custID =  " & ProdCustID

	Set rs2 = Server.CreateObject("ADODB.Recordset")
		rs2.Open sql, conn, 3, 3   
		If not rs2.eof then
			custFirstName = rs2("custFirstName")
			custLastname = rs2("custLastName")
			custCity = rs2("custCity")
			custState = rs2("custState")
			custPhone = rs2("custPhone")
			custEmail = rs2("custEmail")
	%>
	Seller:<br>
&nbsp;&nbsp;<%=custFirstName%>&nbsp;<%=custLastName%><br>
<% If Len(custCity) > 1 Then %>
&nbsp;&nbsp;<%=custCity%>
<% End If %>
<% If Len(custState) > 1 Then %>
, &nbsp;<%=custState%><br>
<% End If %>
<% If Len(custPhone) > 1 Then %>
&nbsp;&nbsp;Phone: <%=custPhone%><br>
<% End If %>
&nbsp;&nbsp;Email: <a href = "mailto:<%=custEmail%>" class = "body"><%=custEmail%></a>
<% 	End If %>
<% Else%>
								
<form target="_paypal" action="https://www.paypal.com/cgi-bin/webscr" method="post">
<input type="hidden" name="add" value="1">
Quantity: <input type="text" name="Quantity" size ="2">
<input type="hidden" name="cmd" value="_cart">
<input type="hidden" name="business" value="jhartwig@clearwire.net">
<input type="hidden" name="item_name" value="<%=Trim(rsA("ProdName"))%>">
<input type="hidden" name="amount" value="<%=FormatCurrency(rsA("Prodprice"))%> ">
<input type="hidden" name="shipping" value="<%=ShippingCost%>">
<input type="hidden" name="no_note" value="1">
<input type="hidden" name="currency_code" value="USD">
<input type="hidden" name="lc" value="US">
<input type="hidden" name="bn" value="PP-ShopCartBF">
<input type="hidden" name="return" value="http://www.ArtisanBarn.org/completion.asp">
<input type="hidden" name="cancel_return" value="http://www.ArtisanBarn.org/BarnStore.asp">
<br>

<input type=submit   border="0" name="submit"  Value = "Add to Cart" >&nbsp;&nbsp;

</form> 
<form target="paypal" action="https://www.paypal.com/cgi-bin/webscr" method="post">
<input type="hidden" name="cmd" value="_cart">
<input type="hidden" name="business" value="jhartwig@clearwire.net">
<input type="hidden" name="display" value="1">
<input type=submit   border="0" name="submit"  Value = "View Cart" >&nbsp;&nbsp;
</form>
</font>
</td>
</tr>
</table>
<% End If	%>