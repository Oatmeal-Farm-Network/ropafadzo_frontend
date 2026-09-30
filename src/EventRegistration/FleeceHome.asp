<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html >
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="Content-Language" content="en-us">
<%  PageName = "Registry" %>
<!--#Include file="AdminEventGlobalVariables.asp"-->
<title>Fleece Show Overview</title><meta http-equiv="Content-Language" content="en-us">
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
<% Current = "Fleece" %>
<!--#Include file="OverviewHeader.asp"-->

<!'--#Include File ="Header.asp"--> 
<!--#Include File ="Scripts.asp"--> 


<%
EventID = request.querystring("EventID")
UpdateFleece= request.querystring("UpdateFleece")

If Request.Querystring("UpdateFleece" ) = "True" Then
	ServiceTypeLookupID= Request.Form("ServiceTypeLookupID") 
   	ServicesID= Request.Form("ServicesID") 
	FeePerAnimal = Request.Form("FeePerAnimal")
	FeePerPen  = Request.Form("FeePerPen")
	MaxQTYCheckbox = Request.Form("MaxQTYCheckbox")
	MaxQTY = Request.Form("MaxQTY")
	MaxQTY2 = Request.Form("MaxQTY2")
	ServiceStartDateMonth = Request.Form("ServiceStartDateMonth")
	ServiceStartDateDay = Request.Form("ServiceStartDateDay")
	ServiceStartDateYear = Request.Form("ServiceStartDateYear")

	
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

 if len(MaxPensPerFarm) > 0 then
  Query =  Query & " MaxPensPerFarm  = " &  MaxPensPerFarm & "," 
else
  Query =  Query & " MaxPensPerFarm  =  0," 
end if


 if len(ServiceStartDateMonth) > 0 then
  Query =  Query & " ServiceStartDateMonth  = " &  ServiceStartDateMonth & "," 
end if

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

Conn.Execute(Query) 
end if


sql = "select * from Services, ServiceTypeLookup where Services.ServiceTypeLookupID = ServiceTypeLookup.ServiceTypeLookupID and ServiceType = 'Fleece Show' and EventID =  " & EventID & " Order by ServicesID Desc"
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
 	StallMatsAvailable  = rs("StallMatsAvailable")
 	StallMatPrice  = rs("StallMatPrice")
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

<!'--#Include file="FleeceHeader.asp"--> 

<a name="Top"></a>
  <table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "<%=screenwidth - 10 %>"><tr><td class = "roundedtop" align = "left">
		<H1><div align = "left">Fleece Show Overview</div></H1>
</td></tr>
<tr>
<% if screenwidth < 800 then %>
<td class = "roundedBottom" width = "100%">
<% else %>
<td class = "roundedBottom" width = "40%">
<% end if %>

<table border = "0"  cellpadding=0 cellspacing=0 width = "100%" align = "center" >
<tr><td valign = "top">
 <% if Proceed = false and UpdateFleece="True" then %>
<table border = "0"  cellpadding=0 cellspacing=0 width = "440" align = "center" >
<tr><td class = "body2" height = "10"><b>* indicates Required fields</b><br>
	
	  <font Color = "red"><b>Your information is incomplete. Please enter:<br>
	   	<% if Startdate = false then %>
	   		- A valid registration start date.<br>
	   	<% end if %>	
	   	<% if Enddate = false then %>
	   		- A valid registration end date.<br>
	   	<% end if %>	

	   	<% if FindFeePerAnimal = false then %>
	   		- A fee per fleece.<br>
	   	<% end if %>
</b></font>

	 </td></tr>

</table>
	 <% end if %>

<form  name=Fleeceform method="post" action="FleeceHome.asp?EventID=<%=EventID%>&UpdateFleece=True">

<br />
<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "100%"><tr><td class = "roundedtop" align = "left">
		<H1><div align = "left">Fleece Show Judges</div></H1>
</td></tr>
<tr><td class = "roundedBottom" >
 <table  border = "0" cellpadding=0 cellspacing=0  valign = "top" width = "440" >
 <tr>
   <td class = "body">
   
    <% sqlb = "select * from Judgesshows, Judges where Judgesshows.JudgeID = Judges.JudgeID and  JudgesShows.EventID = " & EventID & " and ShowType = 'Fleece'"
       
   					Set rsb = Server.CreateObject("ADODB.Recordset")
   					rsb.Open sqlb, conn, 3, 3  
   					if not rsb.eof then %>
   					  Below is the judge or judges for this show:<br>
					<% while not rsb.eof
						JudgeName = rsb("JudgeFirstName") & " " & rsb("JudgeLastName") 
						JudgeID  = rsb("JudgeID")  %>
						&nbsp;&nbsp;&nbsp;&nbsp;<a href = "JudgesEditJudgesDetails.asp?JudgeID=<%=JudgeID%>&EventID=<%=EventID%>" class = "body"><%= JudgeName %></a><br>
   					<% rsb.movenext
   					wend
   					else %>
   					Currently there are no Fleece show judges entered. 
   					
   					<% end if 
   					rsb.close %>
<br>
 
    To add judges to your Fleece show please select <a href = "JudgeAdd.asp?EventID=<%=EventID%>" class = "body">
	Add Judges</a>.
 <br><br>
 <input type="hidden" name="ServiceTypeLookupID" value = <%=ServiceTypeLookupID %> >


   </td>
   </tr>
 </table>
</td>
</tr>
</table>
   
  <br />

<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "100%"><tr><td class = "roundedtop" align = "left">
		<H1><div align = "left">Fees and Dates</div></H1>
</td></tr>
<tr><td class = "roundedBottom" >
 <table  border = "0" cellpadding=0 cellspacing=0  valign = "top" width = "442" >
 	<tr>
	      <td class = "body2" align = "right" ><% if Startdate = false and UpdateFleece="True" then %><font color = "red"><%End if%>
		  Date Registration Starts:&nbsp;<% if Startdate = false and UpdateFleece="True" then %></font><%End if%></td>
			
			<td >
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
					<option value="<%=StartDateDay%>" selected><%=ServiceStartDateDay%></option>
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
						
					For yearv=currentyear+1 To currentyear + 5%>
					<option value="<%=yearv%>"><%=yearv%></option>		
					<% Next %></select>
			</td>
		</tr>

	  	<tr>
	      <td class = "body2" align = "right" ><% if Enddate = false and UpdateFleece="True" then %><font color = "red"><%End if%>
		  Date Registration Ends:&nbsp;<% if Enddate = false and UpdateFleece="True" then %><font color = "yellow"><font><% end if %></td>
			
			<td >
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
					<option value="<%=StartDateDay%>" selected><%=ServiceEndDateDay%></option>
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
						
					For yearv=currentyear+1 To currentyear + 5%>
					<option value="<%=yearv%>"><%=yearv%></option>		
					<% Next %></select>
			</td>
		</tr>

	    <tr>
	      <td class = "body2" align = "right" ><% if FindFeePerAnimal = false and UpdateFleece="True" then %><font color = "red"><%End if%>
		  Fee Per Fleece*:<% if FindFeePerAnimal = false and UpdateFleece="True" then %></font><%End if%> </td>
	      <td class = "body2" colspan = "3"><div align = "top">$<input class="positive" type="text" name = "FeePerAnimal" size = 7 maxsize = 9 value = "<%=FeePerAnimal%>"></div>
				<input type="hidden" name="ServicesID" value = <%=ServicesID %> >
	
	<script type="text/javascript">

	    $(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	
	</script>

	
	      </td>
	    </tr>
  	    <tr>
	    <td class = "body" align = "right">Max. # Fleeces Per Exhibitor Per 
		Class:</td>
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
				</select>
		</td>
	</tr>

	    
	     <tr>
	      <td class = "body2" align = "right" >Fee Per Fleece Discount: </td>
	      <td class = "body2" colspan = "3"><div align = "top">$<input class="positive" type="text" name = "Price1Discount" size = 7 maxsize = 9 value = "<%=Price1Discount%>"></div>
			<script type="text/javascript">
			    $(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
			</script>
	      </td>
	    </tr>

	<tr >
	    <td class = "body" align = "right">Date Fleece Fee Discount Starts:</td>
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
						
					For yearv=currentyear+1 To currentyear + 5%>
					<option value="<%=yearv%>"><%=yearv%></option>		
					<% Next %></select>
		
		</td>
		</tr>
<tr >
	    <td class = "body" align = "right">Date Fleece Fee Discount Ends:</td>
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
						
					For yearv=currentyear+1 To currentyear + 5%>
					<option value="<%=yearv%>"><%=yearv%></option>		
					<% Next %></select>
			</td>
		</tr>
		</table>

</td>
</tr>
</table>
</td>
<% if screenwidth < 800 then %>
</tr>
<tr>
<% end if %>
<% if screenwidth < 800 then %>
<td valign = "top" width = "100%">
<% else %>
<td valign = "top" width = "60%">
<% end if %>

<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "100%"><tr><td class = "roundedtop" align = "left">
		<H1><div align = "left">Fleece Show Description</div></H1>
</td></tr>
<tr><td class = "roundedBottom" >

 		  <%
'*******************************************************************************************
'WYSIWYG Scripts
'*******************************************************************************************
%>  
<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg.js"></script> 

<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg-settings.js"></script>

		<script language="javascript1.2">
  		// attach the editor to the textarea with the identifier 'textarea1'.
  		var mysettings = new WYSIWYG.Settings(); 
    mysettings.Width = "400px"; 
    mysettings.Height = "200px"; 
    WYSIWYG.attach('Description', mysettings); 
  		 
		</script>
 		  <textarea name="Description" cols="40" rows="6" wrap="VIRTUAL" id = "Description"><%= Description%></textarea> 
 		  
 		 
</td></tr></table>


	<tr><td colspan = "3" class = "body2" align = "center">
	<input type = "hidden"  name ="EventID"  value ="<%=EventID%>">
	<input type = "hidden"  name ="EventSubTypeID"  value ="<%=EventSubTypeID%>">
	<center><input type="submit"  value="Submit Changes" class = "Regsubmit2" ></center><br>
	
	
	</td>
	</tr>
</table></form>


</td>
</tr></table>
<!--#Include file="Footer.asp"-->
		
</Body>
</html>