<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<!--#Include file="AdminEventGlobalVariables.asp"-->
<meta http-equiv="Content-Language" content="en-us">
<title>Spin-Off Registration</title>

<meta name="author" content="WebArtists.biz">
<link rel="stylesheet" type="text/css" href="Style.css">

 
<script type="text/javascript" src="/usableforms.js"></script>
<script language="JavaScript" src="/calendar_us.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
<script type="text/javascript" src="jquery.numeric.js"></script>

<script type="text/javascript">function EventTypeFormSubmit() {document.EventTypeForm.submit();}</script>
<script type="text/javascript">function EventServicesFormSubmit() {document.EventServicesForm.submit();}</script>


</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >


<!--#Include file="Header.asp"--> 
<!--#Include file="Scripts.asp"--> 


<%
EventID = request.querystring("EventID")
UpdateSpinOff = false
If Request.Querystring("UpdateSpinOff" ) = "True" Then
UpdateSpinOff = True
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
	
	ServiceStartDateMonth = Request.Form("ServiceStartDateMonth")
	ServiceStartDateDay = Request.Form("ServiceStartDateDay")
	ServiceStartDateYear = Request.Form("ServiceStartDateYear")



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


'response.write("StopDate=" & StopDate)


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



 if len(MaxPensPerFarm) > 0 then
  Query =  Query & " MaxPensPerFarm  = " &  MaxPensPerFarm & "," 
else
  Query =  Query & " MaxPensPerFarm  =  0," 
end if


 if len(ServiceStartDateMonth) > 0 then
  Query =  Query & " ServiceStartDateMonth  = " &  ServiceStartDateMonth & "," 
End if

 if len(ServiceStartDateDay) > 0 then
  Query =  Query & " ServiceStartDateDay  = " &  ServiceStartDateDay & "," 
end if

 if len(ServiceStartDateYear) > 0 and (len(ServiceStartDateMonth) > 0 or len(ServiceStartDateDay) > 0 ) then
  Query =  Query & " ServiceStartDateYear  = " &  ServiceStartDateYear & "," 
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


'response.write("Query = " & Query)
Conn.Execute(Query) 
end if

conn.close

set conn = nothing
Set Conn = Server.CreateObject("ADODB.Connection") 
Conn.Open "DSN=" & DSN_Name & ";UID=admin;PWD=Chickens"
Set rs = Server.CreateObject("ADODB.Recordset")


sql = "select * from Services, ServiceTypeLookup where Services.ServiceTypeLookupID = ServiceTypeLookup.ServiceTypeLookupID and ServiceType = 'SpinOff' and EventID =  " & EventID & " Order by ServicesID Desc"
'response.write(sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then	
	ServiceTypeLookupID = rs("ServiceTypeLookupID")
	ServicesID = rs("ServicesID")
	
	ServiceStartDateMonth  = rs("ServiceStartDateMonth")
	ServiceStartDateDay  = rs("ServiceStartDateDay")
	ServiceStartDateYear  = rs("ServiceStartDateYear")


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



Proceed = True
Startdate = True
Enddate = True 
FindFeePerAnimal = True

if len(ServiceStartDateDay) > 0 and len(ServiceStartDateMonth) > 0 and len(ServiceStartDateYear) > 0 then
else
  Proceed = false
  Startdate = false
end if 

if len(ServiceEndDateDay) > 0 and len(ServiceEndDateMonth) > 0 and len(ServiceEndDateYear) > 0 then
else
  Proceed = false
  Enddate = false
end if

if len(FeePerAnimal) > 0  then
else
  Proceed = false
  FindFeePerAnimal = false
end if


%>

<!--#Include file="SpinOffHeader.asp"--> 
<% PageTitleText = "Spin-Off Show Overview"  %>

<!--#Include file="970Top.asp"-->

<table border = "0"  cellpadding=0 cellspacing=0 width = "960" align = "center" >
	<tr>
	   <td width = "444" valign = "top">
	   
	   	 <% if Proceed = false and UpdateSpinOff = True then %>
	   <table border = "0"  cellpadding=0 cellspacing=0 width = "950" align = "center" >

	<tr><td class = "body2" height = "10"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
		<tr><td class = "body2" height = "10"><b>* indicates Required fields</b><br>

	  <font Color = "red"><b>Your information is incomplete. Please enter:<br>
	   	<% if Startdate = false then %>
	   		- A valid Registration Start Date.<br>
	   	<% end if %>	
	   	<% if Enddate = false then %>
	   		- A valid Registration End Date.<br>
	   	<% end if %>	

	   	<% if FindFeePerAnimal = false then %>
	   		- Please Enter a Fee Per Spin-Off Entry.<br>
	   	<% end if %>


	   		</b></font>
		 </td></tr>
</table>
	 <% end if %>

<% PageTitleText = "Spin-Off Judges"  %>
<br />
<!--#Include file="444Top.asp"--> 
<form  name=SpinOffform method="post" action="SpinOffHome.asp?EventID=<%=EventID%>&UpdateSpinOff=True">
 <table border = "0"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  width = "442" align = "center" >
 <tr>
   <td class = "body">
   
<% 
	sqlb = "select * from Judgesshows, Judges where Judgesshows.JudgeID = Judges.JudgeID and  JudgesShows.EventID = " & EventID & " and ShowType = 'SpinOff'"
      
	Set rsb = Server.CreateObject("ADODB.Recordset")
	rsb.Open sqlb, conn, 3, 3  
	if not rsb.eof then 
		while not rsb.eof
			JudgeName = rsb("JudgeFirstName") & " " & rsb("JudgeLastName") 
			JudgeID  = rsb("JudgeID") %>
			&nbsp;&nbsp;&nbsp;&nbsp;<a href = "JudgesEditJudgesDetails.asp?PeopleID=<%=JudgePeopleID%>&EventID=<%=EventID%>" class = "body"><%= JudgeName %></a><br>
			<% rsb.movenext
		wend
   	else %>
   		Currently there are no Spin-Off show judges entered. 
   					
   	<% end if 
   	rsb.close %>
<br>
 
 To add judges to your Spin-Off show please select <a href = "JudgeAdd.asp?EventID=<%=EventID%>" class = "body">Add Judges</a>.
 <br><br>
 <input type="hidden" name="ServiceTypeLookupID" value = <%=ServiceTypeLookupID %> >
   </td>
   </tr>
   </table>
	

<!--#Include file="444Bottom.asp"--> 

<% PageTitleText = "Spin-Off Registrations"  

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
	<th class = "body" width = "200"><b>Entry</b></th>
	<th class = "body" align = "center"><b>Level</b></th>
</tr>
	
<%

order = "Even"
    OldPeopleID = ""
    NextPeopleID = ""
    oldTotalPaid = ""
    different = False
    TotalEntries = 0
 While  Not rs.eof 
 CurrentOrderPeopleID = rs("PeopleID")
 
 
 EntriesFound = False
 sql2 = "SELECT * from Registration where PeopleID = " & CurrentOrderPeopleID & " and Quantity > 0 and EventID=" & EventID & " Order by RegistrationDateTime Desc,  ServiceDescription desc "
 'response.Write("sql2=" & sql2)
	 Set rs2 = Server.CreateObject("ADODB.Recordset") 
    rs2.Open sql2, conn, 3, 3  
    if not rs2.eof then
    CurrentServiceDescription = rs2("ServiceDescription")
    if instr(rs2("ServiceDescription"), "Vendor") then
      EntriesFound = True
      TotalEntries = TotalEntries + 1
      'Response.Write("Found")
    end if
    end if
   ' EntriesFound = True 
 if EntriesFound = True then
 
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

<form action= 'StoreOrdersHandleForm.asp?Show=<%=CurrentShow%>' method = "post">
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

        <% if len(PeopleFirstName(rowcount) )> 1 or len(PeopleLastName(rowcount) )> 1 then %><%=PeopleLastName(rowcount) %>, <%=PeopleFirstName(rowcount) %><br /> <% end if  %>
        	    <% if len(BusinessName(rowcount) )> 1 then %><%=BusinessName(rowcount) %><% if DisplayAddresses = True then %><br /><% end if %><% end if  %>
        	 <% if DisplayAddresses = True then %>   
        	    <% if len(AddressStreet(rowcount) )> 1 then %><%=AddressStreet(rowcount)%><br /><% end if  %>
		<% if len(AddressApt(rowcount) )> 1 then %><%=AddressApt(rowcount)%><br /><% end if  %>
		<% if len(AddressCity(rowcount) )> 1 then %><%=AddressCity(rowcount)%>, <% end if  %>
		<% if len(AddressState(rowcount) )> 1 then %><%=AddressState(rowcount)%>  <% end if  %> 
		<% if len(AddressZip(rowcount) )> 1 then %><%=AddressZip(rowcount)%><% end if  %>
		<% if len(AddressCountry(rowcount) )> 1 then %><%=AddressCountry(rowcount)%><% end if  %>
		<% end if %>
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

 sqlTB = "select * from VendorLevels where instr('" &  CurrentServiceDescription & "' , VendorStallName)"
    Set rsTB = Server.CreateObject("ADODB.Recordset")
    rsTB.Open sqlTB, conn, 3, 3   
   if not rsTB.eof then
 		CostperTable =rsTB("CostperTable")
   end if 

  rsTB.close
   

if instr(CurrentServiceDescription, "Vendor") then
	  %>	
   <%= right(CurrentServiceDescription, len(CurrentServiceDescription) - 9) %>

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
<b>Total Spin-Off Entries: <%=TotalEntries %></b><img src = "images/px.gif" width = "30" height = "1" />

</td>

</Tr>
</table>

<% else %>
Currently there are no vendor orders.

<% end if %>
 <br>
 
</td></tr>
</table>

<!--#Include file="444Bottom.asp"-->


</td>
<td width = "5"><img src = "images/px.gif" height = "1" width = "1"/></td>
 <td valign = "top"><br />
 <% PageTitleText = "Spin-Off Fees & Dates"  %>
<!--#Include file="505Top.asp"-->
  <table  border = "0" cellpadding=0 cellspacing=0  valign = "top" width = "504" >
<tr><td class = "body2right" ><% if Startdate = false and UpdateSpinOff = True then %><font color = "red"><%End if%>Date registration starts:&nbsp;<% if Startdate = false and UpdateSpinOff = True then %></font><%End if%></td>
			
			<td class = "body2">
			  <select size="1" name="ServiceStartDateMonth">

		<% if len(ServiceStartDateMonth) > 0 then %>
					<option value="<%=ServiceStartDateMonth%>" selected><%=ServiceStartDateMonth%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">Jan.</option>
					<option  value="2">Feb.</option>
					<option  value="3">March</option>
					<option  value="4">April</option>
					<option  value="5">May</option>
					<option  value="6">June</option>
					<option  value="7">July</option>
					<option  value="8">Aug.</option>
					<option  value="9">Sept.</option>
					<option  value="10">Oct.</option>
					<option  value="11">Nov.</option>
					<option  value="12">Dec.</option>
				</select>/
				<select size="1" name="ServiceStartDateDay">
		<% if len(ServiceStartDateDay) > 0 then %>
					<option value="<%=ServiceStartDateDay%>" selected><%=ServiceStartDateDay%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">1</option>
					<option  value="2">2</option>
					<option  value="3">3</option>
					<option  value="4">4</option>
					<option  value="5">5</option>
					<option  value="6">6</option>
					<option  value="7">7</option>
					<option  value="8">8</option>
					<option  value="9">9</option>
					<option  value="10">10</option>
					<option  value="11">11</option>
					<option  value="12">12</option>
					<option  value="13">13</option>
					<option  value="14">14</option>
					<option  value="15">15</option>
					<option  value="16">16</option>
					<option  value="17">17</option>
					<option  value="18">18</option>
					<option  value="19">19</option>
					<option  value="20">20</option>
					<option  value="21">21</option>
					<option  value="22">22</option>
					<option  value="23">23</option>
					<option  value="24">24</option>
					<option  value="25">25</option>
					<option  value="26">26</option>
					<option  value="27">27</option>
					<option  value="28">28</option>
					<option  value="29">29</option>
					<option  value="30">30</option>
					<option  value="31">31</option>
				</select>/
		<select size="1" name="ServiceStartDateYear">
				<% if len(ServiceStartDateYear) > 0 then %>
					<option value="<%=ServiceStartDateYear%>" selected><%=ServiceStartDateYear%></option>
				<% else %>
					<option value="<%=year(now)%>" selected><%=year(now)%></option>
				<% end if %>

					
				
			<% currentyear = year(date) 
						'response.write(currentyear)
					For yearv=currentyear+1 To currentyear + 5%>
					<option value="<%=yearv%>"><%=yearv%></option>		
					<% Next %></select>
			</td>
		</tr>
	  	<tr>
	      <td class = "body2right" ><% if Enddate = false and UpdateSpinOff = True then %><font color = "red"><%End if%>Date registration ends:&nbsp;<% if Startdate = false and UpdateSpinOff = True then %></font><%End if%></td>
			
			<td class = "body2">
			  <select size="1" name="ServiceEndDateMonth">

		<% if len(ServiceEndDateMonth) > 0 then %>
					<option value="<%=ServiceEndDateMonth%>" selected><%=ServiceEndDateMonth%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">Jan.</option>
					<option  value="2">Feb.</option>
					<option  value="3">March</option>
					<option  value="4">April</option>
					<option  value="5">May</option>
					<option  value="6">June</option>
					<option  value="7">July</option>
					<option  value="8">Aug.</option>
					<option  value="9">Sept.</option>
					<option  value="10">Oct.</option>
					<option  value="11">Nov.</option>
					<option  value="12">Dec.</option>
				</select>/
				<select size="1" name="ServiceEndDateDay">
		<% if len(ServiceEndDateDay) > 0 then %>
					<option value="<%=ServiceEndDateDay%>" selected><%=ServiceEndDateDay%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">1</option>
					<option  value="2">2</option>
					<option  value="3">3</option>
					<option  value="4">4</option>
					<option  value="5">5</option>
					<option  value="6">6</option>
					<option  value="7">7</option>
					<option  value="8">8</option>
					<option  value="9">9</option>
					<option  value="10">10</option>
					<option  value="11">11</option>
					<option  value="12">12</option>
					<option  value="13">13</option>
					<option  value="14">14</option>
					<option  value="15">15</option>
					<option  value="16">16</option>
					<option  value="17">17</option>
					<option  value="18">18</option>
					<option  value="19">19</option>
					<option  value="20">20</option>
					<option  value="21">21</option>
					<option  value="22">22</option>
					<option  value="23">23</option>
					<option  value="24">24</option>
					<option  value="25">25</option>
					<option  value="26">26</option>
					<option  value="27">27</option>
					<option  value="28">28</option>
					<option  value="29">29</option>
					<option  value="30">30</option>
					<option  value="31">31</option>
				</select>/
		<select size="1" name="ServiceEndDateYear">
				<% if len(ServiceEndDateYear) > 0 then %>
					<option value="<%=ServiceEndDateYear%>" selected><%=ServiceEndDateYear%></option>
				<% else %>
					<option value="<%=year(now)%>" selected><%=year(now)%></option>
				<% end if %>

					
				
			<% currentyear = year(date) 
						'response.write(currentyear)
					For yearv=currentyear+1 To currentyear + 5%>
					<option value="<%=yearv%>"><%=yearv%></option>		
					<% Next %></select>
			</td>
		</tr>
	    <tr>
	      <td class = "body2right" ><% if FindFeePerAnimal = false and UpdateSpinOff = True then %><font color = "red"><%End if%>Fee per Spin-Off entry*:<% if FindFeePerAnimal = false and UpdateSpinOff = True then %></font><%End if%> </td>
	      <td class = "body2" colspan = "3"><div align = "top">$<input class="positive" type="text" name = "FeePerAnimal" size = 7 maxsize = 9 value = "<%=FeePerAnimal%>"></div>
				<input type="hidden" name="ServicesID" value = <%=ServicesID %> >
	
	<script type="text/javascript">
	
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	
	</script>

	
	      </td>
	    </tr>
	     <tr>
	      <td class = "body2right" >Fee per Spin-Off entry discount: </td>
	      <td class = "body2" colspan = "3"><div align = "top">$<input class="positive" type="text" name = "Price1Discount" size = 7 maxsize = 9 value = "<%=Price1Discount%>"></div>
			<script type="text/javascript">
			$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
			</script>
	      </td>
	    </tr>
	<tr >
	    <td class = "body2right">Date Spin-Off discount starts:</td>
		<td class="body2" colspan = "3">
		  <select size="1" name="Price1DiscountStartDateMonth">

		<% if len(Price1DiscountStartDateMonth) > 0 then %>
					<option value="<%=Price1DiscountStartDateMonth%>" selected><%=Price1DiscountStartDateMonth%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">Jan.</option>
					<option  value="2">Feb.</option>
					<option  value="3">March</option>
					<option  value="4">April</option>
					<option  value="5">May</option>
					<option  value="6">June</option>
					<option  value="7">July</option>
					<option  value="8">Aug.</option>
					<option  value="9">Sept.</option>
					<option  value="10">Oct.</option>
					<option  value="11">Nov.</option>
					<option  value="12">Dec.</option>
				</select>/
				<select size="1" name="Price1DiscountStartDateDay">
		<% if len(Price1DiscountStartDateDay) > 0 then %>
					<option value="<%=Price1DiscountStartDateDay%>" selected><%=Price1DiscountStartDateDay%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">1</option>
					<option  value="2">2</option>
					<option  value="3">3</option>
					<option  value="4">4</option>
					<option  value="5">5</option>
					<option  value="6">6</option>
					<option  value="7">7</option>
					<option  value="8">8</option>
					<option  value="9">9</option>
					<option  value="10">10</option>
					<option  value="11">11</option>
					<option  value="12">12</option>
					<option  value="13">13</option>
					<option  value="14">14</option>
					<option  value="15">15</option>
					<option  value="16">16</option>
					<option  value="17">17</option>
					<option  value="18">18</option>
					<option  value="19">19</option>
					<option  value="20">20</option>
					<option  value="21">21</option>
					<option  value="22">22</option>
					<option  value="23">23</option>
					<option  value="24">24</option>
					<option  value="25">25</option>
					<option  value="26">26</option>
					<option  value="27">27</option>
					<option  value="28">28</option>
					<option  value="29">29</option>
					<option  value="30">30</option>
					<option  value="31">31</option>
				</select>/
		<select size="1" name="Price1DiscountStartDateYear">
				<% if len(Price1DiscountStartDateYear) > 0 then %>
					<option value="<%=Price1DiscountStartDateYear%>" selected><%=Price1DiscountStartDateYear%></option>
				<% else %>
					<option value="<%=year(now)%>" selected><%=year(now)%></option>
				<% end if %>

					
				
			<% currentyear = year(date) 
						'response.write(currentyear)
					For yearv=currentyear+1 To currentyear + 5%>
					<option value="<%=yearv%>"><%=yearv%></option>		
					<% Next %></select>
		
		</td>
		</tr>
<tr >
	    <td class = "body2right" >Date Spin-Off discount ends:</td>
		<td class="body2" colspan = "3">
			  <select size="1" name="Price1DiscountEndDateMonth">

		<% if len(Price1DiscountEndDateMonth) > 0 then %>
					<option value="<%=Price1DiscountEndDateMonth%>" selected><%=Price1DiscountEndDateMonth%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">Jan.</option>
					<option  value="2">Feb.</option>
					<option  value="3">March</option>
					<option  value="4">April</option>
					<option  value="5">May</option>
					<option  value="6">June</option>
					<option  value="7">July</option>
					<option  value="8">Aug.</option>
					<option  value="9">Sept.</option>
					<option  value="10">Oct.</option>
					<option  value="11">Nov.</option>
					<option  value="12">Dec.</option>
				</select>/
				<select size="1" name="Price1DiscountEndDateDay">
		<% if len(Price1DiscountEndDateDay) > 0 then %>
					<option value="<%=StartDateDay%>" selected><%=Price1DiscountEndDateDay%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">1</option>
					<option  value="2">2</option>
					<option  value="3">3</option>
					<option  value="4">4</option>
					<option  value="5">5</option>
					<option  value="6">6</option>
					<option  value="7">7</option>
					<option  value="8">8</option>
					<option  value="9">9</option>
					<option  value="10">10</option>
					<option  value="11">11</option>
					<option  value="12">12</option>
					<option  value="13">13</option>
					<option  value="14">14</option>
					<option  value="15">15</option>
					<option  value="16">16</option>
					<option  value="17">17</option>
					<option  value="18">18</option>
					<option  value="19">19</option>
					<option  value="20">20</option>
					<option  value="21">21</option>
					<option  value="22">22</option>
					<option  value="23">23</option>
					<option  value="24">24</option>
					<option  value="25">25</option>
					<option  value="26">26</option>
					<option  value="27">27</option>
					<option  value="28">28</option>
					<option  value="29">29</option>
					<option  value="30">30</option>
					<option  value="31">31</option>
				</select>/
		<select size="1" name="Price1DiscountEndDateYear">
				<% if len(Price1DiscountEndDateYear) > 0 then %>
					<option value="<%=Price1DiscountEndDateYear%>" selected><%=Price1DiscountEndDateYear%></option>
				<% else %>
					<option value="<%=year(now)%>" selected><%=year(now)%></option>
				<% end if %>

					
				
			<% currentyear = year(date) 
						'response.write(currentyear)
					For yearv=currentyear+1 To currentyear + 5%>
					<option value="<%=yearv%>"><%=yearv%></option>		
					<% Next %></select>
			</td>
		</tr><tr>
	    <td class = "body2right" >Max.# Entries per exhibitor per class:</td>
		<td class="body2" colspan = "3"><select size="1" name="MaxQTY">
		<% if len(MaxQTY) > 0 then %>
					<option value="<%=MaxQTY%>" selected><%=MaxQTY%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">1</option>
					<option  value="2">2</option>
					<option  value="3">3</option>
					<option  value="4">4</option>
					<option  value="5">5</option>
					<option  value="6">6</option>
					<option  value="7">7</option>
					<option  value="8">8</option>
					<option  value="9">9</option>
					<option  value="10">10</option>
					<option  value="11">11</option>
					<option  value="12">12</option>
					<option  value="13">13</option>
					<option  value="14">14</option>
					<option  value="15">15</option>
					<option  value="16">16</option>
					<option  value="17">17</option>
					<option  value="18">18</option>
					<option  value="19">19</option>
					<option  value="20">20</option>
					<option  value="21">21</option>
					<option  value="22">22</option>
					<option  value="23">23</option>
					<option  value="24">24</option>
					<option  value="25">25</option>
					<option  value="50">50</option>
					<option  value="100">100</option>
				</select>
		
		
		</td>
	</tr>
</table>

<table  border = "0" cellpadding=0 cellspacing = "0" width = "500">
 		<tr>
 		  <td><br /><h2>Spin-Off Description</h2>
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
	<tr><td colspan = "3"  align = "center">
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
<!--#Include file="Footer.asp"-->
		
</Body>
</html>