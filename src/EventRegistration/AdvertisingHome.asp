<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<%@ Language=VBScript %>

<HTML>
<HEAD>
<title>Advertising Facts</title>
<link rel="stylesheet" type="text/css" href="style.css">
<!--#Include virtual="globalVariables.asp"--> 
<% 
 '********************************************************************************
 '	ADVERTISING DESCRIPTION AND OPTIONS
 '********************************************************************************

If Request.Querystring("UpdateAdvertising" ) = "True" Then
	ShowSupporters = Request.Form("ShowSupporters")
	ServiceTypeLookupID= Request.Form("ServiceTypeLookupID") 
   ServicesID= Request.Form("ServicesID") 
	FeePerAnimal = Request.Form("FeePerAnimal")
	FeePerPen  = Request.Form("FeePerPen")
	MaxQTYCheckbox = Request.Form("MaxQTYCheckbox")
	MaxQTY = Request.Form("MaxQTY")
	MaxQTY2 = Request.Form("MaxQTY2")
	ServiceEndDateMonth = Request.Form("ServiceEndDateMonth")
	ServiceEndDateDay = Request.Form("ServiceEndDateDay")
	ServiceEndDateYear = Request.Form("ServiceEndDateYear")
	Description = Request.Form("Description")
	EventID = Request.Form("EventID")
	EventSubTypeID = Request.Form("EventSubTypeID")

	Price1Discount= Request.Form("Price1Discount")
	Price1DiscountStartDateMonth  = Request.Form("Price1DiscountStartDateMonth")
	Price1DiscountStartDateDay  = Request.Form("Price1DiscountStartDateDay")
	Price1DiscountStartDateYear  = Request.Form("Price1DiscountStartDateYear")
	Price1DiscountEndDateMonth  = Request.Form("Price1DiscountEndDateMonth")
	Price1DiscountEndDateDay  = Request.Form("Price1DiscountEndDateDay")
	Price1DiscountEndDateYear  = Request.Form("Price1DiscountEndDateYear")

	
	Price2Discount= Request.Form("Price2Discount")
	Price2DiscountStartDateMonth  = Request.Form("Price2DiscountStartDateMonth")
	Price2DiscountStartDateDay  = Request.Form("Price2DiscountStartDateDay")
	Price2DiscountStartDateYear  = Request.Form("Price2DiscountStartDateYear")
	Price2DiscountEndDateMonth  = Request.Form("Price2DiscountEndDateMonth")
	Price2DiscountEndDateDay  = Request.Form("Price2DiscountEndDateDay")
	Price2DiscountEndDateYear  = Request.Form("Price2DiscountEndDateYear")

	Price3  = Request.Form("Price3")
	Price3Discount= Request.Form("Price3Discount")
	Price3DiscountStartDateMonth  = Request.Form("Price3DiscountStartDateMonth")
	Price3DiscountStartDateDay  = Request.Form("Price3DiscountStartDateDay")
	Price3DiscountStartDateYear  = Request.Form("Price3DiscountStartDateYear")
	Price3DiscountEndDateMonth  = Request.Form("Price3DiscountEndDateMonth")
	Price3DiscountEndDateDay  = Request.Form("Price3DiscountEndDateDay")
	Price3DiscountEndDateYear  = Request.Form("Price3DiscountEndDateYear")

str1 = Description
str2 = "'"
If InStr(str1,str2) > 0 Then
	Description= Replace(str1,  str2, "''")
	
End If  


Query =  " UPDATE Services Set Description = '" &  Description & "',"
 if len(MaxQTY) > 0 then
Query =  Query & " ServiceMaxQuantity  = " &  MaxQTY  & "," 
end if
 if len(MaxQTY2) > 0 then
Query =  Query & " ServiceMaxQuantity2  = " &  MaxQTY2  & "," 
end if

 if len(FeePerAnimal) > 0 then
  Query =  Query & " Price  = " &  FeePerAnimal & "," 
else
  Query =  Query & " Price  = 0," 
end if



 if len(ShowSupporters) > 0 then
Query =  Query & " ShowSupporters  = " &  ShowSupporters  & "," 
end if



 if len(MaxPensPerFarm) > 0 then
  Query =  Query & " MaxPensPerFarm  = " &  MaxPensPerFarm & "," 
else
  Query =  Query & " MaxPensPerFarm  =  0," 
end if



 if len(ServiceEndDateMonth) > 0 then
  Query =  Query & " ServiceEndDateMonth  = " &  ServiceEndDateMonth & "," 
end if

 if len(ServiceEndDateDay) > 0 then
  Query =  Query & " ServiceEndDateDay  = " &  ServiceEndDateDay & "," 
end if

 if len(ServiceEndDateYear) > 0 and (len(ServiceEndDateMonth) > 0 or len(ServiceEndDateDay) > 0 ) then
  Query =  Query & " ServiceEndDateYear  = " &  ServiceEndDateYear & "," 
end if



 if len(Price1Discount) > 0 then
  Query =  Query & " Price1Discount  = " &  Price1Discount & "," 
else
  Query =  Query & " Price1Discount  = 0," 
end if



if len(Price1DiscountstartDateMonth) > 0 then
  Query =  Query & " Price1DiscountstartDateMonth  = " &  Price1DiscountstartDateMonth & "," 
end if

 if len(Price1DiscountstartDateDay) > 0 then
  Query =  Query & " Price1DiscountstartDateDay  = " &  Price1DiscountstartDateDay & "," 
end if

 if len(Price1DiscountstartDateYear) > 0 and (len(Price1DiscountstartDateMonth) > 0 or len(Price1DiscountstartDateDay)) then
  Query =  Query & " Price1DiscountstartDateYear  = " &  Price1DiscountstartDateYear & "," 
end if

 if len(Price1DiscountEndDateMonth) > 0 then
  Query =  Query & " Price1DiscountEndDateMonth  = " &  Price1DiscountEndDateMonth & "," 
end if

 if len(Price1DiscountEndDateDay) > 0 then
  Query =  Query & " Price1DiscountEndDateDay  = " &  Price1DiscountEndDateDay & "," 
end if

 if len(Price1DiscountEndDateYear) > 0 and ( len(Price1DiscountEndDateMonth) > 0 or len(Price1DiscountEndDateDay) > 0 ) then
  Query =  Query & " Price1DiscountEndDateYear  = " &  Price1DiscountEndDateYear & "," 
end if


if len(Price2Discount) > 0 then
  Query =  Query & " Price2Discount  = " &  Price2Discount & "," 
else
  Query =  Query & " Price2Discount  = 0," 
end if



if len(Price2DiscountstartDateMonth) > 0 then
  Query =  Query & " Price2DiscountstartDateMonth  = " &  Price2DiscountstartDateMonth & "," 
end if

 if len(Price2DiscountstartDateDay) > 0 then
  Query =  Query & " Price2DiscountstartDateDay  = " &  Price2DiscountstartDateDay & "," 
end if

 if len(Price2DiscountstartDateYear) > 0 and (len(Price2DiscountstartDateMonth) > 0  or len(Price2DiscountstartDateDay) > 0 ) then
  Query =  Query & " Price2DiscountstartDateYear  = " &  Price2DiscountstartDateYear & "," 
end if

 if len(Price2DiscountEndDateMonth) > 0 then
  Query =  Query & " Price2DiscountEndDateMonth  = " &  Price2DiscountEndDateMonth & "," 
end if

 if len(Price2DiscountEndDateDay) > 0 then
  Query =  Query & " Price2DiscountEndDateDay  = " &  Price2DiscountEndDateDay & "," 
end if

 if len(Price2DiscountEndDateYear) > 0 and (len(Price2DiscountEndDateMonth) > 0 or len(Price2DiscountEndDateDay) > 0  ) then
  Query =  Query & " Price2DiscountEndDateYear  = " &  Price2DiscountEndDateYear & "," 
end if

 if len(FeePerPen) > 0 then
  Query =  Query & " Price2  = " &  FeePerPen & "," 
else
  Query =  Query & " Price2  = 0," 
end if


 if len(StopDate1) > 0 then
 Query =  Query & " ServiceEndDate  = '" &  StopDate1 & "'," 
end if 

 Query =  Query & " ExtraField  = ''" 
Query =  Query & " where servicesID = " & servicesID & " and  EventID = " &  EventID & "" 

Conn.Execute(Query) 
end if




sql = "select * from Services, ServiceTypeLookup where Services.ServiceTypeLookupID = ServiceTypeLookup.ServiceTypeLookupID and ServiceType = 'Advertising' and EventID =  " & EventID & " Order by ServicesID Desc"
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then	

ShowSupporters = rs("ShowSupporters")
	ServicesID = rs("ServicesID")
	ServiceEndDateMonth  = rs("ServiceEndDateMonth")
	ServiceEndDateDay  = rs("ServiceEndDateDay")
	ServiceEndDateYear  = rs("ServiceEndDateYear")
	
	Price1Discount= rs("Price1Discount")
	Price1DiscountStartDateMonth  = rs("Price1DiscountStartDateMonth")
	Price1DiscountStartDateDay  = rs("Price1DiscountStartDateDay")
	Price1DiscountStartDateYear  = rs("Price1DiscountStartDateYear")
	Price1DiscountEndDateMonth  = rs("Price1DiscountEndDateMonth")
	Price1DiscountEndDateDay  = rs("Price1DiscountEndDateDay")
	Price1DiscountEndDateYear  = rs("Price1DiscountEndDateYear")

	
	Price2Discount= rs("Price2Discount")
	Price2DiscountStartDateMonth  = rs("Price2DiscountStartDateMonth")
	Price2DiscountStartDateDay  = rs("Price2DiscountStartDateDay")
	Price2DiscountStartDateYear  = rs("Price2DiscountStartDateYear")
	Price2DiscountEndDateMonth  = rs("Price2DiscountEndDateMonth")
	Price2DiscountEndDateDay  = rs("Price2DiscountEndDateDay")
	Price2DiscountEndDateYear  = rs("Price2DiscountEndDateYear")
		
	EventTypeID = rs("EventTypeID")
	FeePerAnimal = rs("Price")
	FeePerPen  =  rs("Price2")
	MaxQTY =  rs("ServiceMaxQuantity")
	MaxQTY2 =  rs("ServiceMaxQuantity2")
	if len(MaxQTY2) > 0 then
	  MaxQTYCheckbox = "checked"
	end if

	StopDate1 =  rs("ServiceEndDate")
	if len(StopDate1) > 0 then
	  StopDate = "checked"
	end if
	Description =  rs("Description")


str1 = Description
str2 = "</br>"
If InStr(str1,str2) > 0 Then
	Description= Replace(str1, str2 , vbCrLf)
	
End If  


str1 = Description
str2 = "&nbsp;"
If InStr(str1,str2) > 0 Then
	Description= Replace(str1,  str2, " ")
End If 

str1 = Description
str2 = "''"
If InStr(str1,str2) > 0 Then
	Description= Replace(str1,  str2, "'")
End If 

	
End If 



if FeePerAnimal = "0" then
   FeePerAnimal = ""
end if

if Price1Discount = "0" then
   Price1Discount = ""
end if

if Price2Discount = "0" then
   Price2Discount = ""
end if


if FeePerPen = "0" then
   FeePerPen = ""
end if

%>

</head>
<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">


<!--#Include virtual="Header.asp"--> 
<!--#Include virtual="AdvertisingHeader.asp"--> 
<%  PageTitleText =  "Advertising Overview"%>
<a name="Top"></a>
 <!--#Include file="970Top.asp"-->

<table border = "0"  cellpadding=0 cellspacing=0 width = "960" align = "center" >
<tr>
<td valign = "top">
<% PageTitleText = "Advertising Options"  %>
<br />
<!--#Include file="444Top.asp"--> 
 <% 
 '********************************************************************************
 '	ADVERTISING OPTIONS
 '********************************************************************************
 %>
      
 
<table border = "0" cellpadding=0 cellspacing=0 width = "440" align = "center">
	<tr><td class = "Menu2" colspan  "3" height = "1">
		
		 <% sql = "select * from AdvertisingLevels  where EventID = " & EventID 

    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if  rs.eof then %>
		Currently you do not have any Advertising options listed. 
		
	
	<% end if %>
		</td></tr>
</table>
<% Dim name(2000) 
rowcount = rowcount
%>

<%
row = "odd"
rowcount = 1
row = "even"

    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then %>

	<table border = "0" cellpadding=0 cellspacing=0 width = "442" align = "left">
	  <tr bgcolor = "#eeeeee">
		     <td class="Menu2" align = "center" width = "300">
	       <b>Title</b>
	     </td>
	     <td class="Menu2" align = "center" width = "70">
	       <b>Price</b>
	     </td>
	     <td class="Menu2" align = "center">
	       <b>Actions&nbsp;</b>
	     </td>

	   </tr>
	<tr><td class = "Menu2" colspan= "6" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
	
	<% 
	order = "odd"
	While Not rs.eof  
	AdvertisingLevelID = rs("AdvertisingLevelID")
	AdvertisingLevelName = rs("AdvertisingLevelName")
	AdvertisingLevelPrice = rs("AdvertisingLevelPrice")
	%>

	<input type = "hidden" name="EventID" value= "<%= EventID %>" >
	<input type = "hidden" name="AdvertisingLevelID" value= "<%= AdvertisingLevelID %>" >
	<% if order = "even" then 
	order = "odd"
		%>
	  <tr bgcolor = "#eeeeee">
	<% else 
	   order = "even"%>
		<tr>
	<% end if %>
	     <td class="Menu2" width = "250">
	       &nbsp;<a href = "AdvertisingEditPageData.asp?AdvertisingLevelID=<%=AdvertisingLevelID%>&EventID=<%=EventID%>" class="Menu2"><%=AdvertisingLevelName%></a>
	     </td>
	     <td class="Menu2" align = "right">
	       <a href = "AdvertisingEditPageData.asp?AdvertisingLevelID=<%=AdvertisingLevelID%>&EventID=<%=EventID%>" class="Menu2" ><% IF LEN(AdvertisingLevelPrice) > 1 then %>
	       																												<%=formatcurrency(AdvertisingLevelPrice,2)%>
	       																											<% else %>
	       																												FREE
	       																											<% end if %></a><img src = "images/px.gif" width = "20" height = "10" alt = "price" border = "0">
	     </td>
     	<td class="Menu2" align = "center">
	      <a href = "AdvertisingEditPageData.asp?AdvertisingLevelID=<%=AdvertisingLevelID%>&EventID=<%=EventID%>"><img src = "images/Edit.gif" width = "15" border = "0" alt = "Edit Advertising Option"></a>  
	      <a href = "AdvertisingLevelDeleteHandleForm.asp?AdvertisingLevelID=<%=AdvertisingLevelID%>&AdvertisingLevelName=<%=AdvertisingLevelName%>&AdvertisingLevelPrice=<%=AdvertisingLevelPrice%>&EventID=<%=EventID%>"><img src = "images/delete.jpg" width = "15" border = "0" alt = "Delete Advertising Option"></a>

	     </td>

	   </tr>
	<tr><td class = "Menu2" colspan = "6"  height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
<% rowcount = rowcount + 1
		rs.movenext
	Wend		
%>
</table>
<% end if %>
<br>
<table width = "440" align = "center">
   <tr><td class="Menu2" >To add advertising options please select  <a href = "AdvertisingsAddOptions.asp?EventID=<%=EventID%>" class = "menu2">Add Advertising Options</a>
   </td>
   </tr>
   </table>
<!--#Include file="444Bottom.asp"--> 


 <%
' **************************************************************
' LIST OF Advertisers
' ************************************************************** %>
 
<% PageTitleText = "List of Registered Advertisers"  

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

<!--#Include file="444Top.asp"-->

<table border = "0" width ="440" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 align = 'center'>
<tr><td colspan = "2" class = "body">


<% Dim OrderEventID(100000) 
	 Dim OrderPeopleID(100000)
	 Dim ServiceID(100000)
	 Dim Payment_status(100000)
	 Dim Payment_amount(100000) 
	 Dim Payment_currency(100000) 
	 dim ServiceDescription(100000)
	dim Payer_email(100000)
    dim first_name(100000)
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
    
    
  sqlfound = false 

if sqlfound = false then    
 sql = "select * from ordersSetupEvents where  EventID = " & EventID & " and Payment_Status = 'Completed' order by DateAdded Desc"
end if

    
rs.Open sql, conn, 3, 3   
rowcount = 1
	
Recordcount = rs.RecordCount +1
if Recordcount > 1 then %>
<br />
<table width = "440" border = "0" bordercolor = "white"  cellpadding=0 cellspacing=0 align = "center">
	<tr bgcolor = "#eeeeee">
	<th class = "body" align = "center"  width = "80"><b>Date</b></th>
	<th class = "body" width = "200"><b>Advertisers</b></th>
	<th class = "body" align = "center"><b>Level</b></th>
</tr>
	
<%

order = "Even"
    OldPeopleID = ""
    NextPeopleID = ""
    oldTotalPaid = ""
    different = False
    TotalAdvertisers = 0
 While  Not rs.eof 
 CurrentOrderPeopleID = rs("PeopleID")
 
 
 AdvertisersFound = False
 sql2 = "SELECT * from Registration where PeopleID = " & CurrentOrderPeopleID & " and Quantity > 0 and EventID=" & EventID & " Order by RegistrationDateTime Desc,  ServiceDescription "
 'response.Write("sql2=" & sql2)
	 Set rs2 = Server.CreateObject("ADODB.Recordset") 
    rs2.Open sql2, conn, 3, 3  
    if not rs2.eof then
    CurrentServiceDescription = rs2("ServiceDescription")
    
        '  Response.Write("CurrentServiceDescription=" & CurrentServiceDescription)
    if instr(rs2("ServiceDescription"), "Advertising") then
      AdvertisersFound = True
      TotalAdvertisers = TotalAdvertisers + 1

    end if
    end if
   ' AdvertisersFound = True 
 if AdvertisersFound = True then
 
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
                oldTotalPaid = cint(oldTotalPaid) + cint(rs("Payment_amount")) 
        
                 rs.movenext
                  if not rs.eof then    
                        NextPeopleID = rs("PeopleID") 
                end if  
                while NewPeopleID = NextPeopleID and not rs.eof
               
                 
                          different = False
                        if  not rs.eof then
                            oldTotalPaid = cint(oldTotalPaid) + cint(rs("Payment_amount")) 
     
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
DisplayAddresses = False
if not skipline = True then
%>

	<input type = "hidden" name="OrderPeopleID(<%=rowcount%>)" value= "<%= OrderPeopleID( rowcount)%>">
	<% if order = "Even" then
	        Order = "Odd" %>
	        <tr>
	  <% else 
	        Order = "Even" %>
	        	<tr bgcolor = "#eeeeee">
	 <% end if
	      %>

	<td class = "body"  valign = "top" width = "80">
		<% if len(DateAdded(rowcount)) > 9 then %>
			<%=FormatDateTime(DateAdded(rowcount),2)%>
		<% end if %>&nbsp;
	<input type = "hidden" name="DateAdded(<%=rowcount%>)" value= "<%=DateAdded(rowcount) %>" ></td>
	<td class = "body"  valign = "top" width = '200'>
<a href = "ReportsEventRegisterEdit.asp?OrderEventID=<%=OrderPeopleID(rowcount) %>&CurrentpeopleID=<%=OrderPeopleID(rowcount) %>" class = "body" >
        <% if len(PeopleFirstName(rowcount) )> 1 or len(PeopleLastName(rowcount) )> 1 then %><%=PeopleLastName(rowcount) %>, <%=PeopleFirstName(rowcount) %><br /> <% end if  %>
        	    <% if len(BusinessName(rowcount) )> 1 then %><%=BusinessName(rowcount) %><% if DisplayAddresses = True then %><br /><% end if %><% end if  %>
        	 <% if DisplayAddresses = True then %>   
        	    <% if len(AddressStreet(rowcount) )> 1 then %><%=AddressStreet(rowcount)%><br /><% end if  %>
		<% if len(AddressApt(rowcount) )> 1 then %><%=AddressApt(rowcount)%><br /><% end if  %>
		<% if len(AddressCity(rowcount) )> 1 then %><%=AddressCity(rowcount)%>, <% end if  %>
		<% if len(AddressState(rowcount) )> 1 then %><%=AddressState(rowcount)%>  <% end if  %> 
		<% if len(AddressZip(rowcount) )> 1 then %><%=AddressZip(rowcount)%><% end if  %>
		<% if len(AddressCountry(rowcount) )> 1 then %><%=AddressCountry(rowcount)%><% end if  %>
		<% end if %></a>
	</td>
	<td class = "body" valign = "Top" align = "right">
		<%
		
	
		sql2 = "SELECT datediff('m', '" & DateAdded(rowcount) & "' ,  RegistrationDateTime  ) AS timepassed, * from Registration where PeopleID = " & OrderPeopleID(rowcount) & " and Quantity > 0 and EventID=" & EventID & " Order by RegistrationDateTime Desc,  ServiceDescription desc "
		 Set rs2 = Server.CreateObject("ADODB.Recordset") 
		'  response.write("sql2=" & sql2) 
    rs2.Open sql2, conn, 3, 3  
    
    while not rs2.eof
     CurrentServiceDescription = rs2("ServiceDescription")  


str1 = CurrentServiceDescription
str2 = "'"
If InStr(str1,str2) > 0 Then
	CurrentServiceDescription= Replace(str1,  str2, "''")
End If 

   

if instr(CurrentServiceDescription, "Advertising") then
	  %>	
   <%= right(CurrentServiceDescription, len(CurrentServiceDescription) - 14) %>

<%
end if
rs2.movenext
wend
 
end if

end if

		rowcount = rowcount + 1
	   rs.movenext
	Wend
TotalCount=rowcount 
	rs.close
%>
</td>
	</tr>
<Tr>
<td class = "body" align = "right" colspan = "3"><br />
<b>Total Advertisers: <%=TotalAdvertisers %></b><img src = "images/px.gif" width = "30" height = "1" />

</td>

</Tr>
</table>

<% else %>
<center><b>Currently there are no advertising orders.</b></center>

<% end if %>
 <br>
 
</td></tr>
</table>
<!--#Include file="444Bottom.asp"--> 
</td>
<td valign = "top"><br />
<% PageTitleText = "Advertising Page"  %>
<!--#Include file="505Top.asp"-->
 <form  name=Advertisingform method="post" action="AdvertisingHome.asp?EventID=<%=EventID%>&UpdateAdvertising=True">
 
		<table  border = "0" cellpadding=0 cellspacing = "0" width = "500">
		<tr>
	  <td class = "body2" colspan = "2" >Show Registered Advertisers on Event Webpage?
  		<%
   		
  		 if ShowSupporters = "True" then %>
		<small>Yes</small><input TYPE="RADIO" name="ShowSupporters" Value = "Yes" checked >
		<small>No</small><input TYPE="RADIO" name="ShowSupporters" Value = "No" >
		<% else %>
		<small>Yes</small><input TYPE="RADIO" name="ShowSupporters" Value = "Yes" >
		<small>No</small><input TYPE="RADIO" name="ShowSupporters" Value = "No" checked>
		<% end if %>
		</td>
	</tr>

		<tr>
 			<td class = "body2" colspan = "2"><br><h2>Advertising Description</h2></td>
 		</tr>
 		<tr>
 		  <td>
 		  <%
'*******************************************************************************************
'WYSIWYG Scripts
'*******************************************************************************************
%>  
<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg.js"></script> 

<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg-settings.js"></script>

		<script language="javascript1.2">
  		// attach the editor to the textarea with the identifier 'textarea1'.
  		 WYSIWYG.attach("textarea1");
		</script>
 		  


	  <textarea name="Description" cols="60" rows="6" wrap="VIRTUAL" id = "textarea1"><%= Description%></textarea> </td>
	</tr>
	<tr><td colspan = "3" class = "body2" align = "center">
	
	<input type="hidden" name="ServiceTypeLookupID" value = <%=ServiceTypeLookupID %> >
		<input type="hidden" name="ServicesID" value = <%=ServicesID %> >
	<input type = "hidden"  name ="EventID"  value ="<%=EventID%>">
	<input type = "hidden"  name ="EventSubTypeID"  value ="<%=EventSubTypeID%>">
	<input type="submit"  value="Submit Changes" class = "Regsubmit2" ><br>
	
	
	</td>
	</tr>
</table>

</form>
<!--#Include file="505Bottom.asp"--> 
</td>
</tr>
</table>



 <!--#Include file="970Bottom.asp"-->
<br>
<br>


<!--#Include virtual="Footer.asp"--> 
</Body>
</HTML>
