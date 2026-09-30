<!DOCTYPE html>
<html>
<head>
<!--#Include file="GlobalVariables.asp"-->
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title>Registry Registration</title>

<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="Style.css">

 
<script type="text/javascript" src="/usableforms.js"></script>
<script language="JavaScript" src="/calendar_us.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
<script type="text/javascript" src="jquery.numeric.js"></script>

<script type="text/javascript">function EventTypeFormSubmit() {document.EventTypeForm.submit();}</script>
<script type="text/javascript">function EventServicesFormSubmit() {document.EventServicesForm.submit();}</script>


<%
OrderEventID = request.querystring("OrderEventID")
EventTotalIncome = 0
 Set rs = Server.CreateObject("ADODB.Recordset") 
  Set rs2 = Server.CreateObject("ADODB.Recordset") 
Show=request.form("Show")
if len(Show) < 1 then
  Show = request.QueryString("Show")
end if
 					
If len(Show) < 1 then
  CurrentShow = ""
else
	CurrentShow = Show
End if	
					


			
Sort=request.form("Sort") 
If Len(Sort) < 4 Then
	Sort = "Prodname"
End if
%>

</HEAD>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >


<!--#Include file="Header.asp"--> 
<!--#Include file="Scripts.asp"--> 

<!--#Include file="ReportsHeader.asp"--> 

<a name="Top"></a>
<% PageTitleText = "Delete Registration"  %>
<!--#Include file="970Top.asp"-->
<br>
<table border = "0" width = "960">
<tr>
<td align = "center" valign = "top">
	
<% 
    TotalOrder = "0"
 
 sql = "select * from ordersSetupEvents where  EventID = " & EventID & " and OrderEventID=" & OrderEventID & " order by DateAdded Desc"

    
rs.Open sql, conn, 3, 3   
if  Not rs.eof  then

  
 OrderEventID=rs("OrderEventID")
OrderPeopleID=rs("PeopleID")
Payment_status=rs("Payment_status")
Payment_amount=rs("Payment_amount")
Payment_currency=rs("Payment_currency")
Payer_email=rs("Payer_email")
first_name=rs("first_name")
last_name=rs("last_name")
DateAdded = rs("DateAdded")

		
sql2 = "select * from People where PeopleID = " & OrderPeopleID 


    Set rs2 = Server.CreateObject("ADODB.Recordset")
    rs2.Open sql2, conn, 3, 3   
   if not rs2.eof then
  
		PeopleFirstName =rs2("PeopleFirstName")
		PeopleLastName=rs2("PeopleLastName")
		PeopleEmail=rs2("PeopleEmail")
        BusinessID = rs2("BusinessID")
        AddressID = rs2("AddressID")
   end if 

  rs2.close

if len(BusinessID) > 0 then
sql2 = "select * from Business where BusinessID = " & BusinessID 

'response.write (sql2)
    Set rs2 = Server.CreateObject("ADODB.Recordset")
    rs2.Open sql2, conn, 3, 3   
   if not rs2.eof then
  
		BusinessName=rs2("BusinessName")  
   end if 

  rs2.close
end if 


if len(AddressID) > 0 then
sql2 = "select * from Address where AddressID = " & AddressID 

'response.write (sql2)
    Set rs2 = Server.CreateObject("ADODB.Recordset")
    rs2.Open sql2, conn, 3, 3   
   if not rs2.eof then
  
		AddressStreet=rs2("AddressStreet") 
		AddressApt=rs2("AddressApt")
		AddressCity=rs2("AddressCity")  
		AddressState=rs2("AddressState")    
		AddressZip=rs2("AddressZip") 
		AddressCountry=rs2("AddressCountry")    
   end if 

  rs2.close
end if 
 %>

 

<table width = "905" border = "0"  cellpadding=0 cellspacing=0 align = "center">
<tr>
 <td width = "450" valign = "top">
 <table width = "430" border = "0"  cellpadding=2 cellspacing=2 align = "center">
<tr >
    <td class = "body" width = "110" valign = "top" align = "right">Order date:</td>
	<td class = "body"  valign = "top" align = "left">
		<% if len(DateAdded) > 9 then %>
		 	<%=DateAdded%>
		<% end if %>&nbsp;
	</td>
	</tr>
	<tr>
	  <td class = "body"  valign = "top" align = "right">Registrants name:</td>
	<td class = "body"  valign = "top">

        <% if len(PeopleFirstName )> 1 or len(PeopleLastName )> 1 then %><%=PeopleLastName %>, <%=PeopleFirstName %><br /> <% end if  %>
        	    <% if len(BusinessName )> 1 then %><%=BusinessName %><% if DisplayAddresses = True then %><br /><% end if %><% end if  %>
        	 <% if DisplayAddresses = True then %>   
        	    <% if len(AddressStreet )> 1 then %><%=AddressStreet%><br /><% end if  %>
		<% if len(AddressApt )> 1 then %><%=AddressApt%><br /><% end if  %>
		<% if len(AddressCity )> 1 then %><%=AddressCity%>, <% end if  %>
		<% if len(AddressState )> 1 then %><%=AddressState%>  <% end if  %> 
		<% if len(AddressZip )> 1 then %><%=AddressZip%><% end if  %>
		<% if len(AddressCountry )> 1 then %><%=AddressCountry%><% end if  %>
		<% end if %>
	</td>
	</tr>
	<tr>
	  <td class = "body"  valign = "top" align = "right">Business name:</td>
	<td class = "body"  valign = "top">
       	    <% if len(BusinessName )> 1 then %><%=BusinessName %><% if DisplayAddresses = True then %><br /><% end if %><% end if  %>
        </td>
	</tr>
	<tr>
	  <td class = "body"  valign = "top" align = "right">Address:</td>
	<td class = "body"  valign = "top">
         <% if len(AddressStreet )> 1 then %><%=AddressStreet%><br /><% end if  %>
		<% if len(AddressApt )> 1 then %><%=AddressApt%><br /><% end if  %>
		<% if len(AddressCity )> 1 then %><%=AddressCity%>, <% end if  %>
		<% if len(AddressState )> 1 then %><%=AddressState%>  <% end if  %> 
		<% if len(AddressZip )> 1 then %><%=AddressZip%><% end if  %>
		<% if len(AddressCountry )> 1 then %><%=AddressCountry%><% end if  %>
	</td>
	</tr>
	
	</table>
 
 </td>
	<td width = "5"><img src = "images/px.gif" />
	<td width = "450">
	
	
	<table border = "0" cellpadding = "0" cellspacing = "0" >
	<tr>
		  <td class = "body"  valign = "top"><b>Ordered items</b><br />
		  <table border = "0" cellpadding = "0" cellspacing = "0" >
		  <tr>
		  <td class = "body" align = "center" width = "260"><b>Service</b></td>
		  <td class = "body" align = "center" width = "50"><b>QTY</b></td>
		  <td class = "body" align = "center" width = "70"><b>Price</b></td>
		  <td class = "body" align = "center" width = "70"><b>Total</b></td>
		  </tr>
		 <tr>
		    <td  class = "body" valign = "top" >

		<%
		sql2 = "SELECT datediff('m', '" & DateAdded & "' ,  RegistrationDateTime  ) AS timepassed, * from Registration where PeopleID = " & OrderPeopleID & " and Quantity > 0 and EventID=" & EventID 
		 Set rs2 = Server.CreateObject("ADODB.Recordset") 
		   ' response.write("sql2=" & sql2) 
    rs2.Open sql2, conn, 3, 3  

    while not rs2.eof  
     CurrentServiceDescription = rs2("ServiceDescription")
 
str1 = CurrentServiceDescription
str2 = "'"
If InStr(str1,str2) > 0 Then
	CurrentServiceDescription= Replace(str1,  str2, "''")
End If 

 sqlTB = "select * from VendorLevels where instr('" &  CurrentServiceDescription & "' , VendorStallName)"
    Set rsTB = Server.CreateObject("ADODB.Recordset")
    rsTB.Open sqlTB, conn, 3, 3   
   if not rsTB.eof then
 		CostperTable =rsTB("CostperTable")
   end if 
 
  rsTB.close


     if timepassed < 5 then %>
	     <%=rs2("ServiceDescription") %><br />
	    <%  if rs2("ExtraTables") > 0 then %>
	        Extra Tables<br />
	    <% end if %>
	<% 
	end if  
	rs2.movenext
	wend  
	  %></td>

	  <td class = "body" valign = "top" align = "center">
  
     <%
     rs2.movefirst
  while not rs2.eof 
      Quantity = rs2("Quantity")   
      if timepassed < 5 then  %> 
      <%   if len(rs2("ItemPrice")) > 1 then %>
	      <%= Quantity %><br />
	<% end if  %>
	 <%  if rs2("ExtraTables") > 0 then %>
	        <%=rs2("ExtraTables") %><br />
	    <% end if %>
	<% end if  
	rs2.movenext
	wend  
	  %>	
	</td>  
	 <td class = "body" valign = "top" align = "right">
  
     <%
     rs2.movefirst
  while not rs2.eof  
      if timepassed < 5 then  %> 
      <%   if len(rs2("ItemPrice")) > 1 then %>
	     <%=formatcurrency(rs2("ItemPrice")) %><br />
	       <%  if rs2("ExtraTables") > 0 then 
	                extratablecost = CostperTable * rs2("ExtraTables") 
		       %>
	       <%= formatcurrency(extratablecost)%> <br />
	    <% end if %>
	<% end if  
	end if  
	rs2.movenext
	wend  
	  %>	
		&nbsp;</td>  
	  
	  
	  
	 <td class = "body" valign = "top" align = "right">
  
     <%
     rs2.movefirst
  while not rs2.eof  
    Quantity = rs2("Quantity")   
      if timepassed < 5 then  %> 
      <%   if len(rs2("ItemPrice")) > 1 then 
      TotalOrder = TotalOrder + rs2("ItemPrice") * Quantity
      
      %>
	     <%=formatcurrency(rs2("ItemPrice") * Quantity ) %><br />
	       <%  if rs2("ExtraTables") > 0 then 
	                extratablecost = CostperTable * rs2("ExtraTables") 
	       TotalOrder = TotalOrder + extratablecost 
	       %>
	       
	       <%= formatcurrency(extratablecost)%><br />
	    <% end if %>
	<% end if  
	end if  
	rs2.movenext
	wend  
	  %>	
		&nbsp;</td>  </tr>
	
<% 
		rowcount = rowcount + 1
 end if
rs.close
%>
<tr>
<td colspan = "3" class = "body" align = "right"><b>Total Order</b></td>
<td class = "body" align = "right">
<% if len(TotalOrder) > 1 then %>

<b><%= formatcurrency(TotalOrder)%></b><img src = "images/px.gif" width = "3" height = "1" />
<% end if %>
</td>
</tr>
<tr>
<td colspan = "3" class = "body" align = "right"><b>Total Paid</b></td>
<td class = "body" align = "right">
<% if len(Payment_amount) > 1 then %>

<b><%= formatcurrency(Payment_amount)%></b><img src = "images/px.gif" width = "3" height = "1" />
<% else %>
$0.00
<% end if %>
</td>
</tr>


</table>

</td></tr>
</table>	
	

	
	


 <br>
</td>
</table>
<center><font color = "brown" size = "3"><b>Are you sure that you wish to delete this registration?</b></font></center>

<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "200" align = "center">
<tr>
<td>
<form  name=form method="post" action="ReportRegistrationsList.asp">


      <input type="Submit" value="Go Back" class = "regsubmit2">
</form>

</td>
<td align = "left">
<form  name=form method="post" action="RegistrationDeleteHandleForm.asp?OrderEventID=<%=OrderEventID%>">
  <input type="hidden" name="EventID" value="<%=EventID%>" />
  <input type="hidden" name="OrderPeopleID" value="<%=OrderPeopleID%>" />      
		<input type="Submit" value="Delete" class = "regsubmit2">

	</form>


</td>
</tr>
</table>
<br>
<!--#Include file="970Bottom.asp"-->


 <br> <br>
<!--#Include file="Footer.asp"--> </Body>
</HTML>