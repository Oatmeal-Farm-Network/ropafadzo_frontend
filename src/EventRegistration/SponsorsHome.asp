<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html >
<%@ Language=VBScript %>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="Content-Language" content="en-us">
<%  PageName = "Registry" %>
<!--#Include file="AdminEventGlobalVariables.asp"-->
<title>Sponsor Facts</title>
<meta http-equiv="Content-Language" content="en-us">
<meta name="author" content="The Andresen Group"/>
<link rel="stylesheet" type="text/css" href="/style.css" />

<script type="text/javascript" src="/usableforms.js"></script>
<script language="JavaScript" src="/calendar_us.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
<script type="text/javascript" src="jquery.numeric.js"></script>

<script type="text/javascript">function EventTypeFormSubmit() {document.EventTypeForm.submit();}</script>
<script type="text/javascript">function EventServicesFormSubmit() {document.EventServicesForm.submit();}</script>
</head>


<% if mobiledevice = True  then %>
<body >
<% else %>
<body onresize="window.location.replace(window.location.href.split('?')[0]  + '?ScreenWidth=' + self.innerWidth);">
<% end if %>


<% Current = "admin" %>
<!--#Include file="AdminEventsHeader.asp"-->
<% Current = "Sponsers" %>
<!--#Include file="OverviewHeader.asp"-->

<!'--#Include File ="Header.asp"--> 
<!--#Include File ="SponsorHeader.asp"--> 


<%
dim SponsorshipLevelNamearray(1000)
dim SponsorlevelQTYarray(1000)

x = 0

sql = "select * from Services, ServiceTypeLookup where Services.ServiceTypeLookupID = ServiceTypeLookup.ServiceTypeLookupID and ServiceType = 'Sponsor' and  EventID =  " & EventID & ""
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then
	ServiceTypeLookupID = rs("ServiceTypeLookupID")
	ServiceEndDateMonth = rs("ServiceEndDateMonth")
	ServiceEndDateDay = rs("ServiceEndDateDay")
	ServiceEndDateYear = rs("ServiceEndDateYear")
	Description = rs("Description")
	MaxDate = rs("MaxDate")
	servicesID = rs("servicesID")
	
	StopDate = ""
	if MaxDate = "True" then
	  StopDate = "Checked"
	end if 
End If 




sql = "select * from Sponsor where EventID =  " & EventID & ""
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then
	NumberofSponsors = rs.recordcount
	
End If 


%>

<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "100%"><tr><td class = "roundedtop" align = "left">
		<H1><div align = "left">Edit Sponsorship Options</div></H1>
</td></tr>
<tr><td class = "roundedBottom" >

<a name="Edit"></a>
<table border = "0"  cellpadding=0 cellspacing=0 width = "100%" align = "center" >
	<tr>
	   <td  valign = "top" WIDTH = "350" class = "body">
	   To add sponsorship options please select <a href ="SponsorshipAdd.asp?EventID=<%=EventID%>" class = "body">Add Sponsorship Options</a>.<br><br />	

<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "100%"><tr><td class = "roundedtop" align = "left">
		<H1><div align = "left">Options</div></H1>
</td></tr>
<tr><td class = "roundedBottom" >

<%
' *****************************************************************************************
'	SPONSORSHIP OPTIONS	
' *****************************************************************************************
	EventID = request.querystring("EventID")

  sql = "select * from  SponsorshipLevels  where SponsorshipLevels.EventID = " & EventID
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	if not rs.eof then 
%>
		Below are a list of the Sponsorship Options for your event:
<% else
%>
<blockquote>Currently there are no sponsorship options listed.  To add sponsorship options please select <a href ="SponsorshipAdd.asp?EventID=<%=EventID%>" class = "body">Add Sponsorship Options</a>.</blockquote>


<% end if 
	row = "odd"
	rowcount = 1
 	sql = "select * from SponsorshipLevels  where EventID = " & EventID
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then 
	rowcount = 1  
		if not rs.eof then %>
<table border = "0"  cellpadding=0 cellspacing=0 width = "440" align = "center" >
	  <tr bgcolor = "#DBF5F3">
	  <td class="body2" align = "center" width= "175">
	      <b>Title</b>
     </td>
     <td class="body2" align = "center" width = "150">
	       <b>Price</b>
	 </td>
	 <td class="body2" align = "center">
	       <b>Actions</b>
	  </td>
	</tr>
	<tr><td class = "body2" colspan= "6" bgcolor = "#abacab" height = "1"></td></tr>

	
   <% end if 
	
	
	While Not rs.eof %>
	
	
	<%	SponsorshipLevelID = rs("SponsorshipLevelID")
		SponsorshipLevelName= rs("SponsorshipLevelName")
		SponsorshipLevelDescription= rs("SponsorshipLevelDescription")
		SponsorshipLevelPrice = rs("SponsorshipLevelPrice")
		SponsorshipLevelQTYAvailable = rs("SponsorshipLevelQTYAvailable")
		SponsorshipLevelMaxQtyPer = rs("SponsorshipLevelMaxQtyPer")

		
		
	%>
		<% if order = "even" then 
	order = "odd"
		%>
	  <tr bgcolor = "#DBF5F3">
	<% else 
	   order = "even"%>
		<tr>
	<% end if %>
	     <td class="body2">
	       <a href = "SponsorEditDetails.asp?SponsorshipLevelID=<%=SponsorshipLevelID%>&SponsorshipLevelName=<%=SponsorshipLevelName%>&EventID=<%=EventID%>" class = "body"><%=SponsorshipLevelName %></a>
	     </td>
	     <td class="body2" align = "right">
	        <a href = "SponsorEditDetails.asp?SponsorshipLevelID=<%=SponsorshipLevelID%>&SponsorshipLevelName=<%=SponsorshipLevelName%>&EventID=<%=EventID%>"><% if len(SponsorshipLevelPrice) > 0 then %><%=formatcurrency(SponsorshipLevelPrice,2)%><%else %><%=SponsorshipLevelPrice%><% end if %></a><img src = "images/px.gif" width = "10" height = "1" border = "0" />
	     </td>
     	<td class="body2" align = "center">
	      <a href = "SponsorEditDetails.asp?SponsorshipLevelID=<%=SponsorshipLevelID%>&SponsorshipLevelName=<%=SponsorshipLevelName%>&EventID=<%=EventID%>"><img src = "images/Edit.gif" width = "15" border = "0" alt = "Edit Sponsorship Level"></a>&nbsp;&nbsp;&nbsp; 
	      <a href = "SponsorDeleteHandleForm.asp?SponsorshipLevelID=<%=SponsorshipLevelID%>&SponsorshipLevelName=<%=SponsorshipLevelName%>&EventID=<%=EventID%>"><img src = "images/delete.jpg" width = "15" border = "0" alt = "Delete Sponsorship Option"></a>&nbsp;&nbsp;&nbsp;
	     </td>
	   </tr>
  
<% rowcount = rowcount + 1
		rs.movenext
	Wend		
%>

</table>
</form>

<% end if %>
</td>
</tr>
</table>

<br />
 
<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "100%"><tr><td class = "roundedtop" align = "left">
		<H1><div align = "left">Sponsorship Registrations</div></H1>
</td></tr>
<tr><td class = "roundedBottom" >

<table border = "0" width ="350" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 align = 'center'>
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
    dim Halternotes(100000)
    dim SponsorNotes(100000)
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
    
   rs.close 
  sqlfound = false 

if sqlfound = false then    
 sql = "select * from ordersSetupEvents where  EventID = " & EventID & " and Payment_Status = 'Completed' order by DateAdded Desc"
end if
    
rs.Open sql, conn, 3, 3   
rowcount = 1
	
Recordcount = rs.RecordCount +1
if Recordcount > 1 then %>
<table width = "440" border = "0" bordercolor = "white"  cellpadding=0 cellspacing=0 align = "center">
	<tr bgcolor = "#eeeeee">
	<th class = "body" align = "center"  width = "80"><b>Date</b></th>
	<th class = "body" width = "200"><b>Sponsor</b></th>
	<th class = "body" align = "center"><b>Level</b></th>
</tr>
	
<%

order = "Even"
    OldPeopleID = ""
    NextPeopleID = ""
    oldTotalPaid = ""
    different = False
    TotalSponsors = 0
 While  Not rs.eof 
 CurrentOrderPeopleID = rs("PeopleID")
 
 
 SponsorFound = False
 sql2 = "SELECT * from Registration where PeopleID = " & CurrentOrderPeopleID & " and Quantity > 0 and EventID=" & EventID & " Order by RegistrationDateTime Desc,  ServiceDescription desc "
      'Response.Write("sql2=" & sql2)
	 Set rs2 = Server.CreateObject("ADODB.Recordset") 
    rs2.Open sql2, conn, 3, 3  
    while not rs2.eof 
    'response.Write("ServiceDescription=" & rs2("ServiceDescription"))
    
    CurrentServiceDescription = rs2("ServiceDescription")
    if instr(rs2("ServiceDescription"), "Sponsorship") then
      SponsorFound = True
      TotalSponsors = TotalSponsors + 1
     'Response.Write("Found")
    end if
   rs2.movenext
   wend
   ' SponsorFound = True 
 if SponsorFound = True then
 
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

       <a href = "ReportsEventRegisterEdit.asp?OrderEventID=<%= OrderEventID(rowcount)%>&CurrentpeopleID=<%= OrderPeopleID(rowcount)%>" class = "body"> <% if len(PeopleFirstName(rowcount) )> 1 or len(PeopleLastName(rowcount) )> 1 then %><%=PeopleLastName(rowcount) %>, <%=PeopleFirstName(rowcount) %><br /> <% end if  %>
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

   

if instr(CurrentServiceDescription, "Sponsorship") then
	  %>	
   <%= right(CurrentServiceDescription, len(CurrentServiceDescription) - 14) %>&nbsp;&nbsp;

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
<b>Total Sponsors: <%=TotalSponsors %></b><img src = "images/px.gif" width = "30" height = "1" />

</td>

</Tr>
</table>

<% else %>
<blockquote>Currently there are no sponsorship orders.</blockquote>

<% end if %>

 
</td></tr>
</table>

</td></tr></table>


<% if screenwidth < 800 then %>
</td></tr><tr><td valign = "top">
<% else %>
<td width = "15"> <img src = "images/px.gif" height = "1" width ="1" /></td>
<td valign = "top">
<% end if %>


<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "100%"><tr><td class = "roundedtop" align = "left">
		<H1><div align = "left">Sponsorships Page</div></H1>
</td></tr>
<tr><td class = "roundedBottom" >
<%
' *****************************************************************************************
'	SPONSORSHIP DESCRIPTION
' *****************************************************************************************
%> 
<%
 ShowSupporters = True
 If Request.Querystring("UpdateSponsor" ) = "True" Then
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
    ServicesID = Request.Form("ServicesID")
	EventSubTypeID = Request.Form("EventSubTypeID")
	VetCheckFee  = Request.Form("VetCheckFee")
 	ElectrictyFee  = Request.Form("ElectrictyFee")
  	MaxPensPerFarm  = Request.Form("MaxPensPerFarm")
 	StallMatsAvailable  = Request.Form("StallMatsAvailable")
 	StallMatPrice  = Request.Form("StallMatPrice")

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


Query =  " UPDATE Services Set "


 if len(ShowSupporters) > 0 then
Query =  Query & " ShowSupporters  = " &  ShowSupporters  & "," 
end if


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


 if len(StallMatsAvailable) > 0 then
  Query =  Query & " StallMatsAvailable  = " &  StallMatsAvailable & "," 
  else
  Query =  Query & " StallMatsAvailable  = 0," 
end if


 if len(StallMatPrice) > 0 then
  Query =  Query & " StallMatPrice  = " &  StallMatPrice & "," 
  else
  Query =  Query & " StallMatPrice  = 0," 
end if


 if len(VetCheckFee) > 0 then
  Query =  Query & " VetCheckFee  = " &  VetCheckFee & "," 
else
  Query =  Query & " VetCheckFee  = 0," 
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
Query =  Query & " Description = '" &  Description & "'"
Query =  Query & " where servicesID = " & servicesID & " and  EventID = " &  EventID & "" 

if len(servicesid) > 0 and len(eventID) > 0 then
Conn.Execute(Query) 
end if


end if

EventID = request.querystring("EventID")
if len(EventID) > 0 then
sql = "select * from Services, ServiceTypeLookup where Services.ServiceTypeLookupID = ServiceTypeLookup.ServiceTypeLookupID and ServiceType = 'Sponsor' and EventID =  " & EventID & " Order by ServicesID Desc"
'response.write("sql=" & sql)

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
 	StallMatsAvailable  = rs("StallMatsAvailable")
 	StallMatPrice  = rs("StallMatPrice")
	ElectricityFee = rs("ElectricityFee")
	VetCheckFee = rs("VetCheckFee")
	MaxPensPerFarm = rs("MaxPensPerFarm")
	StallMatsAvailable = rs("StallMatsAvailable")
	StallMatPrice = rs("StallMatPrice")
		
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

end if

%>




<form  name=Sponsorform method="post" action="SponsorsHome.asp?EventID=<%=EventID%>&UpdateSponsor=True">
		<table  border = "0" cellpadding=0 cellspacing = "0" width = "500">
		<tr>
	  <td class = "body2" colspan = "2" >Show Registered Sponsors on Event Webpage?
  		<% if ShowSupporters = True then %>
		<small>Yes</small><input TYPE="RADIO" name="ShowSupporters" Value = "1" checked >
		<small>No</small><input TYPE="RADIO" name="ShowSupporters" Value = "0" >
		<% else %>
		<small>Yes</small><input TYPE="RADIO" name="ShowSupporters" Value = "1" >
		<small>No</small><input TYPE="RADIO" name="ShowSupporters" Value = "0" checked>
		<% end if %>
		</td>
	</tr>

		<tr>
 			<td class = "body2" colspan = "2"><br><h2>Sponsorship Page Description</h2></td>
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
	<input type="submit"  value="Submit Change" class = "regsubmit2" >
</form>
</td>
</tr>
</table>

</td></tr></table>
</td>
</tr>
</table>

</td></tr></table>
<br>


<!--#Include virtual="Footer.asp"--> 
</Body>
</HTML>
