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
    dim Halternotes(100000)
    dim VendorNotes(100000)
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
    

   sql = "select * from ordersSetupEvents, People where  ordersSetupEvents.peopleID = People.peopleID and EventID = " & EventID & " and ( Payment_Status = 'Completed' or Payment_Status = 'Updated' ) order by " & Sort
   
'   response.Write("sql=" & sql)


    
rs.Open sql, conn, 3, 3   
rowcount = 1
	
Recordcount = rs.RecordCount +1
if Recordcount > 1 then %>
<br /><h1>Registrations</h1>
<table width = "700" border = "0" bordercolor = "white"  cellpadding=0 cellspacing=0 align = "center">
	<tr >
	<th class = "body" align = "center" width = "50"><b>Date</b></th>
	<th class = "body" width = "200"><b>Registrant</b></th>
	<% if not EventTypeID = 5 then %>
		<th class = "body" width = "65"><b>Price</b></th>
 <% end if  %>
	<th class = "body" width = "300"><b>Service</b></th>
	<% if not EventTypeID = 5 then %>
	<th class = "body" width = "85"><b>Total Paid</b></th>
	<% end if %>

</tr>
	
<%

order = "Even"
    OldPeopleID = ""
    NextPeopleID = ""
    oldTotalPaid = ""
    different = False
    
 While  Not rs.eof 
 CurrentpeopleID = rs("PeopleID")
  Rsql = "select Registration.* from Registration where Quantity > 0 and EventID = " & EventID & " and PeopleID = " & CurrentPeopleID 
  

 'response.Write("Rsql=" & Rsql)
  Set Rrs = Server.CreateObject("ADODB.Recordset") 
 Rrs.Open Rsql, conn, 3, 3   
 
 morethanone = False
   while different = False  
    skipline = False 
    
       

 
        NewPeopleID = rs("PeopleID") 
        if len(oldTotalPaid) < 1 then
            oldTotalPaid = rs("Payment_amount")
        end if 
       
        rs.movenext
       if not rs.eof then    
            NextPeopleID = rs("PeopleID") 
       end if    

       
       if NewPeopleID = NextPeopleID then
morethanone = true
            different = False
            if  not rs.eof then
            if len(rs("Payment_amount")) > 0 then
                oldTotalPaid = cint(oldTotalPaid) + cint(rs("Payment_amount")) 
           end if
                 rs.movenext
                  if not rs.eof then    
                        NextPeopleID = rs("PeopleID") 
                end if  
                while NewPeopleID = NextPeopleID and not rs.eof
               
                 
                          different = False
                        if  not rs.eof then
                         if len(rs("Payment_amount")) > 0 then
                            oldTotalPaid = cint(oldTotalPaid) + cint(rs("Payment_amount")) 
         end if
                         end if
                         rs.movenext
                        if not rs.eof then    
                        NextPeopleID = rs("PeopleID") 
                     end if  
                 wend
                
                    different = True
            end if
     else
     different = True
    end if
   
  rs.moveprevious
 wend 
 
 if morethanone = False then
 oldTotalPaid = rs("Payment_amount")
 end if
 OrderEventID(rowcount)=rs("OrderEventID")
OrderPeopleID(rowcount)=rs("PeopleID")
Payment_status(rowcount)=rs("Payment_status")
Payment_amount(rowcount)=oldTotalPaid
Payment_currency(rowcount)=rs("Payment_currency")
Payer_email(rowcount)=rs("Payer_email")
first_name(rowcount)=rs("first_name")
last_name(rowcount)=rs("last_name")
DateAdded(rowcount) = rs("DateAdded")

		
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

if not skipline = True then


 sql2 = "SELECT datediff('m', '" & DateAdded(rowcount) & "' ,  RegistrationDateTime  ) AS timepassed, * from Registration where PeopleID = " & OrderPeopleID(rowcount) & " and Quantity > 0 and EventID=" & EventID 
		'response.Write("sql2=" & sql2)
		 Set rs2 = Server.CreateObject("ADODB.Recordset") 
    rs2.Open sql2, conn, 3, 3 
    
     Dontshow = False
     CurrentServiceDescription = rs2("ServiceDescription")
    if ShowRegistrations = "Classes" then
       if not instr(CurrentServiceDescription, "Classes") > 0 then
      Dontshow  = True
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

	<td class = "body" width = "55" valign = "top">
		<% if len(DateAdded(rowcount)) > 9 then %>
			<%=FormatDateTime(DateAdded(rowcount),2)%>
		<% end if %>&nbsp;
	<input type = "hidden" name="DateAdded(<%=rowcount%>)" value= "<%=DateAdded(rowcount) %>" ></td>
	<td class = "body" width = "200" valign = "top">

        <% if len(PeopleFirstName(rowcount) )> 1 or len(PeopleLastName(rowcount) )> 1 then %><%=PeopleLastName(rowcount) %>, <%=PeopleFirstName(rowcount) %><br /> <% end if  %>
        	    <% if len(BusinessName(rowcount) )> 1 then %><%=BusinessName(rowcount) %>
 
        	    <% if DisplayAddresses = "True" then %><br /><% end if %><% end if  %>
        	 <% if DisplayAddresses = "True" then %>   
        	    <% if len(AddressStreet(rowcount) )> 1 then %><%=AddressStreet(rowcount)%><br /><% end if  %>
		<% if len(AddressApt(rowcount) )> 1 then %><%=AddressApt(rowcount)%><br /><% end if  %>
		<% if len(AddressCity(rowcount) )> 1 then %><%=AddressCity(rowcount)%>, <% end if  %>
		<% if len(AddressState(rowcount) )> 1 then %><%=AddressState(rowcount)%>  <% end if  %> 
		<% if len(AddressZip(rowcount) )> 1 then %><%=AddressZip(rowcount)%><% end if  %>
		<% if len(AddressCountry(rowcount) )> 1 then %>&nbsp;<%=AddressCountry(rowcount)%><% end if  %>
		<% end if %>
	</td>
	<% if not EventTypeID = 5 then %>
		<td class = "body"   width = "80" valign = "top" align = "right">
		<% end if
		
	
		
     CurrentServiceDescription = rs2("ServiceDescription")
    while not rs2.eof 
    Dontshow = False
    if ShowRegistrations = "Classes" then
       if not instr(CurrentServiceDescription, "Classes") > 0 then
      Dontshow  = True
end if 
end if 
  
    if instr(CurrentServiceDescription, "Classes") > 0 then
  ClassIncome = ClassIncome + ( rs2("ItemPrice") * rs2("Quantity") )
  end if
  
  
if Dontshow = False then
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
    
     ' if timepassed < 5 then  
         if len(rs2("ItemPrice")) > 1 then %>
	     <%=formatcurrency(rs2("ItemPrice")) %><br />
	       <%  if rs2("ExtraTables") > 0 then 
	                extratablecost = CostperTable * rs2("ExtraTables") 
	       
	       %>
	       <% if len(extratablecost) > 0 then %>
	       <%= formatcurrency(extratablecost)%> <br />
	        <% end if %>
	    <% end if %>
	<% end if  
	end if  
	rs2.movenext
	wend  
	  %>	<% if not EventTypeID = 5 then %>
		&nbsp;</td>
		<%end if %>
			<td class = "body" valign = "top">
 <%

 rs2.movefirst

  while not rs2.eof
   
     Dontshow = False
     CurrentServiceDescription = rs2("ServiceDescription")
    if ShowRegistrations = "Classes" then
       if not instr(CurrentServiceDescription, "Classes") > 0 then
      Dontshow  = True
end if 
end if  
   if Dontshow = False then %>
    &nbsp;&nbsp;<%=rs2("Quantity") %>&nbsp;
	     <%=rs2("ServiceDescription") %><br />
	    <%  if rs2("ExtraTables") > 0 then %>
	     &nbsp;&nbsp;<%= rs2("ExtraTables") %> Extra Tables<br />
	    <% end if %>
	<% 
	end if  
	rs2.movenext
	wend  
	  %></td>
	  <% if not EventTypeID = 5 then %>
		<td class = "body2" valign = "Top" align = "right">
		    <% if len(Payment_amount(rowcount))> 0 then %><%=formatcurrency(Payment_amount(rowcount),2) %> <% end if %>
		    
		    <%
		    
		    if len(Payment_amount(rowcount)) > 0 then
		     EventTotalIncome = EventTotalIncome + Payment_amount(rowcount) 
		     end if
		     %>
		</td>
		<% end if  %>
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
<% if not EventTypeID = 5 then %>

<% showclassTotal = True
if showclassTotal = True then %>


<tr>
<td colspan = "4" class = "body" align = "right"><div align = "right"><b>Income from Classes:</b></div></td>
<td  class = "body" align = "right"><b><%=formatcurrency(ClassIncome , 2) %></b></td>
<td ></td>
</tr>
<% end if %>
<tr>
<td colspan = "4" class = "body" align = "right"><div align = "right"><b>Total Income:</b></div></td>
<td  class = "body" align = "right"><b><%=formatcurrency(EventTotalIncome , 2) %></b></td>
<td ></td>
</tr>
<% end if %>
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