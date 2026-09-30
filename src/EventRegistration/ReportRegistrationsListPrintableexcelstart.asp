<!DOCTYPE html>
<html>

<head>

<!--#Include file="GlobalVariables.asp"-->
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title>Registry Registration</title>

<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="StylePrintable.css">




<%
eventID = 14
EventTotalIncome = 0
 Set rs = Server.CreateObject("ADODB.Recordset") 
  Set rs2 = Server.CreateObject("ADODB.Recordset") 
Show=request.querystring("ShowAddress")
if len(Show) < 1 then
  Show = request.QueryString("Show")
end if
 					
If len(Show) < 1 then
  CurrentShow = ""
else
	CurrentShow = Show
End if	
					

ClassIncome = 0
			
Sort=request.form("Sort") 
If Len(Sort) < 4 Then
	Sort = "PeopleLastName"
End if

If Len(Sort) = "Name" Then
	Sort = "PeopleLastName"
End if

If Len(Sort) = "BusinessName" Then
	Sort = "BusinessID"
End if

If Len(Sort) = "Date" Then
	Sort = "DateAdded"
End if

If Len(Sort) = "ServiceType" Then
	Sort = "DateAdded"
End if




%>

</HEAD>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >
<!--#Include file="Scripts.asp"--> 
<div id="printcontent">
<a name="Top"></a>
<% PageTitleText = "List of Registrations"  %>
<br>
<table border = "0" width = "700">
<tr>
<td align = "center" valign = "top">

<table   border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 align = "center" width = "700">
	<tr>

		<td class = "body"><br />
			
<% 	 DisplayAddresses = request.Querystring("DisplayAddresses")
ShowRegistrations = request.Querystring("ShowRegistrations")
OrderRegistrations = request.Querystring("OrderRegistrations")		
    	
 %>

		
		</td>
	</tr>
</table>
<table border = "0" width ="700" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
<tr><td colspan = "2">


<% Dim OrderEventID(100000) 
	 Dim OrderPeopleID(100000)
	 Dim ServiceID(100000)
	 Dim Payment_status(100000)
	 Dim Payment_amount(100000) 
	 Dim Payment_currency(100000) 
	 dim ServiceDescription(100000)
	dim Payer_email(100000)
    dim first_name(100000)

    dim DontNeedTable(100000)
    dim BusinessName(100000)
    dim last_name(100000)
    dim PeopleFirstName(100000)
    dim PeopleLastName(100000)
    dim Peopleemail(100000)
    dim BusinessId(100000)
    dim DateAdded(100000)
    dim AddressID(100000)
    dim AddressStreet(100000)
    dim AddressApt(100000)
    dim AddressCity(100000)
    dim AddressState(100000)   
    dim AddressZip(100000)
    dim AddressCountry(100000)
    dim ItemPrice(100000)
    dim Quantity(100000)
    dim ExtraTables(100000)

   sql = "select * from RegistrationTemp, People where Quantity > 0 and  RegistrationTemp.peopleID = People.peopleID  and EventID = " & EventID & " and ( Status = 'Paid' or Status = 'Update' ) order by " & Sort
   
      sql = "select * from RegistrationTemp,   People where Quantity > 0 and  RegistrationTemp.peopleID = People.peopleID and  EventID = " & EventID & " and ( Status = 'Paid' or Status = 'Update' ) order by " & Sort


rs.Open sql, conn, 3, 3   
rowcount = 1
	
Recordcount = rs.RecordCount +1
if Recordcount > 1 then %>
<br /><h1>Registrations</h1>
<table  border = "0" width = "2000" bordercolor = "white"  cellpadding=0 cellspacing=0 align = "center">
	<tr >
	<th class = "body" align = "center" width = "50"><b>Date</b></th>
			<th class = "body"><b>Last Name</b></th>
			<th class = "body" ><b>First Name</b></th>
	<th class = "body" ><b>Business</b></th>
	<th class = "body" ><b>EMail</b></th>
	<th class = "body" "><b>Street</b></th>
		<th class = "body" "><b>Apt</b></th>
		<th class = "body" "><b>City</b></th>
		<th class = "body" "><b>State</b></th>
		<th class = "body" "><b>Zip</b></th>
		<th class = "body" "><b>Country</b></th>
  
	<% if not EventTypeID = 5 then %>
		<th class = "body" ><b>Price</b></th>
 <% end if  %>
	<th class = "body" ><b>Service Type</b></th>
	<th class = "body" ><b>QTY</b></th>
	<th class = "body" ><b>Service</b></th>
	<th class = "body" ><b># Extra Tables</b></th>
	<th class = "body" ><b>Vendor Notes</b></th>

</tr>
	
<%

order = "Even"
    OldPeopleID = ""
    NextPeopleID = ""
    oldTotalPaid = ""
    different = False
    
 While  Not rs.eof 
 CurrentpeopleID = rs("PeopleID")
 RegistrationID = rs("RegistrationID")
 OrderEventID(rowcount)=rs("EventID")
OrderPeopleID(rowcount)=rs("PeopleID")
Payment_status(rowcount)=rs("Status")
Payer_email(rowcount)=rs("PeopleEmail")
first_name(rowcount)=rs("PeopleFirstName")
last_name(rowcount)=rs("PeopleLastName")
DateAdded(rowcount) = rs("RegistrationDateTime")
ItemPrice(rowcount) = rs("ItemPrice")
Quantity(rowcount) = rs("Quantity")
ServiceDescription(rowcount) = rs("ServiceDescription")
	ExtraTables(rowcount) = rs("ExtraTables")	
	
if len(RegistrationID) < 0 then
else
  Set rsn = Server.CreateObject("ADODB.Recordset") 	
 sqln = "select * from RegistrationNotes where RegistrationID = " & RegistrationID
   
rsn.Open sqln, conn, 3, 3 
if not rsn.eof then  	
	Vendornotes = rsn("Vendornotes")
	Halternotes = rsn("Halternotes")
end if
rsn.close
end if	
sql2 = "select * from People where PeopleID = " & OrderPeopleID(rowcount) 


    Set rs2 = Server.CreateObject("ADODB.Recordset")
    rs2.Open sql2, conn, 3, 3   
   if not rs2.eof then
  
		PeopleFirstName(rowcount) =rs2("PeopleFirstName")
		PeopleLastName(rowcount)=rs2("PeopleLastName")
		PeopleEmail(rowcount)=rs2("PeopleEmail")
        BusinessID(rowcount) = rs2("BusinessID")
        AddressID(rowcount) = rs2("AddressID")
   end if 

  rs2.close

if len(BusinessID(rowcount)) > 0 then
sql2 = "select * from Business where BusinessID = " & BusinessID(rowcount) 

'response.write (sql2)
    Set rs2 = Server.CreateObject("ADODB.Recordset")
    rs2.Open sql2, conn, 3, 3   
   if not rs2.eof then
  
		BusinessName(rowcount)=rs2("BusinessName")  
   end if 

  rs2.close
end if 


if len(AddressID(rowcount)) > 0 then
sql2 = "select * from Address where AddressID = " & AddressID(rowcount) 

'response.write (sql2)
    Set rs2 = Server.CreateObject("ADODB.Recordset")
    rs2.Open sql2, conn, 3, 3   
   if not rs2.eof then
  
		AddressStreet(rowcount)=rs2("AddressStreet") 
		AddressApt(rowcount)=rs2("AddressApt")
		AddressCity(rowcount)=rs2("AddressCity")  
		AddressState(rowcount)=rs2("AddressState")    
		AddressZip(rowcount)=rs2("AddressZip") 
		AddressCountry(rowcount)=rs2("AddressCountry")    
   end if 

  rs2.close
end if 
skipline = false
if not skipline = True then


 sql2 = "SELECT datediff('m', '" & DateAdded(rowcount) & "' ,  RegistrationDateTime  ) AS timepassed, * from Registration where PeopleID = " & OrderPeopleID(rowcount) & " and Quantity > 0 and EventID=" & EventID 
		'response.Write("sql2=" & sql2)
		 Set rs2 = Server.CreateObject("ADODB.Recordset") 
    rs2.Open sql2, conn, 3, 3 
    
     Dontshow = False
     CurrentServiceDescription = rs2("ServiceDescription")
    if ShowRegistrations = "Classes" then
       if not instr(CurrentServiceDescription, "Classes") > 0 then
      Dontshow  = false
end if 
end if  
   if Dontshow = False then 
%>

<form action= 'StoreOrdersHandleForm.asp?Show=<%=CurrentShow%>' method = "post">
	<input type = "hidden" name="OrderPeopleID(<%=rowcount%>)" value= "<%= OrderPeopleID( rowcount)%>">

<% if order = "Even" then
	        Order = "Odd" %>
	        <tr>
	  <% else 
	        Order = "Even" %>
	        	<tr >
	 <% end if
	      %>

	<td class = "body"  valign = "top">
		<% if len(DateAdded(rowcount)) > 9 then %>
			<%=FormatDateTime(DateAdded(rowcount),2)%>
		<% end if %>&nbsp;
	<input type = "hidden" name="DateAdded(<%=rowcount%>)" value= "<%=DateAdded(rowcount) %>" ></td>
	<td class = "body"  valign = "top">
        <% if len(PeopleLastName(rowcount) )> 1  then %><%=PeopleLastName(rowcount) %> <% end if  %>
        </td>
        	<td class = "body"  valign = "top">

        <% if len(PeopleFirstName(rowcount) )> 1  then %> <%=PeopleFirstName(rowcount) %><% end if  %> 
        </td>
        <td class = "body"  valign = "top">
        	    <% if len(BusinessName(rowcount) )> 1 then %><%=BusinessName(rowcount) %> <% end if  %>
 </td>
  <td class = "body2"  valign = "top" align = "left">
 <% if len(Payer_email(rowcount)) > 0 then%>
		<%=Payer_email(rowcount)%>
<% end if %>
</td>
 
 <td class = "body"  valign = "top">
        	   
        
        	    <% if len(AddressStreet(rowcount) )> 1 then %><%=AddressStreet(rowcount)%><% end if  %>
        	    </td>
 <td class = "body"  valign = "top">
		<% if len(AddressApt(rowcount) )> 1 then %><%=AddressApt(rowcount)%><% end if  %></td>
 <td class = "body"  valign = "top">
		<% if len(AddressCity(rowcount) )> 1 then %><%=AddressCity(rowcount)%> <% end if  %></td>
 <td class = "body"  valign = "top">	<% if len(AddressState(rowcount) )> 1 then %><%=AddressState(rowcount)%>  <% end if  %> </td>
 <td class = "body"  valign = "top">	<% if len(AddressZip(rowcount) )> 1 then %><%=AddressZip(rowcount)%><% end if  %>		</td>
 <td class = "body"  valign = "top">
		<% if len(AddressCountry(rowcount) )> 1 then %><%=AddressCountry(rowcount)%><% end if  %>
</td>
 <td class = "body2"  valign = "top" align = "right">
 <% if len(ItemPrice(rowcount)) > 0 then%>
		<%=formatcurrency(ItemPrice(rowcount))%>
<% end if %>&nbsp;&nbsp;
</td>


 <td class = "body"  valign = "top">
 	<% str1 = ServiceDescription(rowcount)
         str2 = "Vendor"
        If InStr(str1,str2) > 0 Then %>
Vendor
<% end if %>
 	<% str1 = ServiceDescription(rowcount)
         str2 = "Sponsor"
        If InStr(str1,str2) > 0 Then %>
Sponsor
<% end if %>
 	<% str1 = ServiceDescription(rowcount)
         str2 = "Class"
        If InStr(str1,str2) > 0 Then %>
Class
<% end if %>
</td>
 <td class = "body"  valign = "top">
		<%=Quantity(rowcount)%>
</td>
 <td class = "body"  valign = "top">
  	<% str1 = ServiceDescription(rowcount)
         str2 = "Vendor - "
        If InStr(str1,str2) > 0 Then 
           	ServiceDescription(rowcount)= Replace(str1, str2 , "")
         end if %>
 	<% str1 = ServiceDescription(rowcount)
         str2 = "Sponsor - "
        If InStr(str1,str2) > 0 Then 
        	ServiceDescription(rowcount)= Replace(str1, str2 , "")
        end if %>
 	<% str1 = ServiceDescription(rowcount)
         str2 = "Classes - "
        If InStr(str1,str2) > 0 Then 
           	ServiceDescription(rowcount)= Replace(str1, str2 , "")
         end if %>
 
 
		<%=ServiceDescription(rowcount)%>
</td>
 <td class = "body"  valign = "top">
		<%=ExtraTables(rowcount)%>
</td>
 <td class = "body"  valign = "top">
		<%=Vendornotes%>
</td>
</tr>
	
<% 
end if
end if

		rowcount = rowcount + 1
	   rs.movenext
	Wend
TotalCount=rowcount 
	rs.close
%>

</table>

<% else %>
<center><b>Currently there are no orders.</b></center>

<% end if %>
 <br>
 
</td></tr>
</table>
 <br> </td>
 </tr>
</table>
</div>

</Body>
</HTML>