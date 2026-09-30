<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html >
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="Content-Language" content="en-us">
<%  PageName = "Registry" %>
<!--#Include file="AdminEventGlobalVariables.asp"-->
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
<% Current = "Dashboard"%>
<!--#Include file="OverviewHeader.asp"-->
<!--#Include file="Scripts.asp"-->
<%

ShowSpinOff = False
ShowHalterShow = False
ShowFleeceShow = False
ShowVendors = False
ShowSponsors = False
ShowClasses = False
ShowSilentauction = False



If Request.Querystring("UpdatePages" ) = "True" Then
ShowSitePages = request.Form("ShowSitePages")
response.write("ShowSitePages=" & ShowSitePages )

  		sqlp = "select * from EventpageLayout where EventID = " & EventID
			Set rsp = Server.CreateObject("ADODB.Recordset")
			rsp.Open sqlp, conn, 3, 3
			if not rsp.eof then 
			 while Not rsp.eof 
			 PageName = rsp("PageName")
			str1 = ShowSitePages 
			str2 = PageName
			If InStr(str1, str2) > 0 Then
				Query =  " UPDATE EventpageLayout Set "
                Query =  Query & " ShowPage = 1"
                Query =  Query & " where EventID = " & EventID & " and PageName = '" & PageName & "' ;" 
                response.write("Query=" & Query )

Conn.Execute(Query) 	
			If InStr(str1, "Halter Show") > 0 Then
				Query =  " UPDATE EventpageLayout Set "
                Query =  Query & " ShowPage = 1"
                Query =  Query & " where EventID = " & EventID & " and PageName = 'Halter Show' ;" 
			Conn.Execute(Query) 
			response.write("Query=" & Query )
			end if 
	        else
				Query =  " UPDATE EventpageLayout Set "
                Query =  Query & " ShowPage = 0"
                Query =  Query & " where EventID = " & EventID & " and PageName = '" & PageName & "' ;" 
                    response.write("Query=" & Query )
Conn.Execute(Query) 
			End If  
			
			 rsp.movenext
			wend 
		 end if 
end if
	' End Update Pages
	
	
	If Request.Querystring("SetLive") = "False" Then
Query =  " UPDATE Event Set "
Query =  Query & " EventStatus = 'Draft'"
Query =  Query & " where EventID = " & EventID & ";" 

Conn.Execute(Query) 

response.redirect("regManageHome.asp?EventID=" & EventID & "#Basics")

end if 

If Request.Querystring("SetLive" ) = "True" Then
Query =  " UPDATE Event Set "
Query =  Query & " EventStatus = 'Published'"
Query =  Query & " where EventID = " & EventID & ";" 
Conn.Execute(Query) 

response.redirect("regManageHome.asp?EventID=" & EventID & "#Basics")
end if 

If Request.Querystring("UpdateHome" ) = "True" Then
	EventDescription = Request.Form("EventDescription")
	
	Dim str1
	Dim str2
	str1 = EventDescription
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		EventDescription= Replace(str1,  str2, "''")
	End If  

Query =  " UPDATE Event Set "
Query =  Query & " EventDescription = '" &  EventDescription & "'"
Query =  Query & " where EventID = " & EventID & ";" 

Conn.Execute(Query) 
end if

If Request.Querystring("UpdateSponsor" ) = "True" Then
	ServiceEndDateMonth= Request.Form("ServiceEndDateMonth")
	ServiceEndDateDay = Request.Form("ServiceEndDateDay")
	StopDateYear = Request.Form("StopDateYear")
	Description = Request.Form("Description")
	EventID = Request.Form("EventID")
	MaxDate = Request.Form("MaxDate")
	ServiceTypeLookupID = Request.Form("ServiceTypeLookupID")
	servicesID = Request.Form("servicesID")
		
	str1 = Description
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		Description= Replace(str1,  str2, "''")
	End If  

Query =  " UPDATE Services Set "
 if len(ServiceEndDateMonth) > 0 then
Query =  Query & " ServiceEndDateMonth  = " &  ServiceEndDateMonth  & "," 
end if
 if len(ServiceEndDateDay) > 0 then
  Query =  Query & " ServiceEndDateDay  = " &  ServiceEndDateDay & "," 
end if
 if len(ServiceEndDateYear) > 0 then
  Query =  Query & " ServiceEndDateYear  = " &  ServiceEndDateYear & "," 
end if

if len(MaxDate) > 0 then
	Query =  Query & " MaxDate = " &  MaxDate & ","
end if
Query =  Query & " Description = '" &  Description & "'"
Query =  Query & " where servicesID = " & servicesID & ";" 

Conn.Execute(Query) 
response.redirect("RegManageHome.asp?EventID=" & EventID & "#Sponsors" )
end if

If Request.Querystring("UpdateClasses" ) = "True" Then
	ServiceEndDateMonth= Request.Form("ServiceEndDateMonth")
	ServiceEndDateDay = Request.Form("ServiceEndDateDay")
	StopDateYear = Request.Form("StopDateYear")
	Description = Request.Form("Description")
	EventID = Request.Form("EventID")
	MaxDate = Request.Form("MaxDate")
	ServiceTypeLookupID = Request.Form("ServiceTypeLookupID")
	servicesID = Request.Form("servicesID")
		
	str1 = Description
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		Description= Replace(str1,  str2, "''")
	End If  

Query =  " UPDATE Services Set "
 if len(ServiceEndDateMonth) > 0 then
Query =  Query & " ServiceEndDateMonth  = " &  ServiceEndDateMonth  & "," 
end if
 if len(ServiceEndDateDay) > 0 then
  Query =  Query & " ServiceEndDateDay  = " &  ServiceEndDateDay & "," 
end if
 if len(ServiceEndDateYear) > 0 then
  Query =  Query & " ServiceEndDateYear  = " &  ServiceEndDateYear & "," 
end if

if len(MaxDate) > 0 then
	Query =  Query & " MaxDate = " &  MaxDate & ","
end if
Query =  Query & " Description = '" &  Description & "'"
Query =  Query & " where servicesID = " & servicesID & ";" 

Conn.Execute(Query) 
response.redirect("RegManageHome.asp?EventID=" & EventID & "#Classes" )

end if

If Request.Querystring("UpdateSilentAuction" ) = "True" Then

	
	ServiceEndDateMonth= Request.Form("ServiceEndDateMonth")
	ServiceEndDateDay = Request.Form("ServiceEndDateDay")
	StopDateYear = Request.Form("StopDateYear")
	Description = Request.Form("Description")
	EventID = Request.Form("EventID")
	MaxDate = Request.Form("MaxDate")
	ServiceTypeLookupID = Request.Form("ServiceTypeLookupID")
	servicesID = Request.Form("servicesID")
		
	str1 = Description
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		Description= Replace(str1,  str2, "''")
	End If  



Query =  " UPDATE Services Set "
 if len(ServiceEndDateMonth) > 0 then
Query =  Query & " ServiceEndDateMonth  = " &  ServiceEndDateMonth  & "," 
end if
 if len(ServiceEndDateDay) > 0 then
  Query =  Query & " ServiceEndDateDay  = " &  ServiceEndDateDay & "," 
end if
 if len(ServiceEndDateYear) > 0 then
  Query =  Query & " ServiceEndDateYear  = " &  ServiceEndDateYear & "," 
end if

if len(MaxDate) > 0 then
	Query =  Query & " MaxDate = " &  MaxDate & ","
end if
Query =  Query & " Description = '" &  Description & "'"
Query =  Query & " where servicesID = " & servicesID & ";" 

Conn.Execute(Query) 
response.redirect("RegManageHome.asp?EventID=" & EventID )

end if

If Request.Querystring("UpdateHalter" ) = "True" Then

	FeePerAnimal = Request.Form("FeePerAnimal")
	FeePerPen  = Request.Form("FeePerPen")
	MaxQTY = Request.Form("MaxQTY2")
	StopDate = Request.Form("StopDate")
	StopDate1 = Request.Form("StopDate1")
	Description = Request.Form("Description")
	EventID = Request.Form("EventID")
	EventTypeID = Request.Form("EventTypeID")

str1 = Description
str2 = "'"
If InStr(str1,str2) > 0 Then
	Description= Replace(str1,  str2, "''")
	
End If  



Query =  " UPDATE Services Set Description = '" &  Description & "',"
 if len(MaxQTY) > 0 then
Query =  Query & " ServiceMaxQuantity  = " &  MaxQTY  & "," 
end if
 if len(FeePerAnimal) > 0 then
  Query =  Query & " Price  = " &  FeePerAnimal & "," 
end if
 if len(FeePerAnimal) > 0 then
  Query =  Query & " Price2  = " &  FeePerAnimal & "," 
end if
 if len(FeePerAnimal) > 0 then
 Query =  Query & " ServiceEndDate  = '" &  StopDate1 & "'," 
end if 

 Query =  Query & " Discount  = 0" 
Query =  Query & " where EventID = " & EventID & ";" 

Conn.Execute(Query) 
end if



 
AddEventTypeID=Request.querystring("AddEventTypeID")
if AddEventTypeID="True" then
	EventTypeID = Request.Form("EventTypeID")


Query =  " UPDATE Event Set EventTypeID = " &  EventTypeID & "" 
Query =  Query & " where EventID = " & EventID & ";" 

Conn.Execute(Query) 

end if 

'******************************************************************************************
'  FIND THE WEBSITE ID'S FOR THE LOCATION WEBSITE AND THE BUSINESS WEBSITE
'******************************************************************************************

sql = "select WebsitesID from websites where Website = '" & EventLocationWebsite & "' order by WebsitesID Desc;" 

Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

If Not rs.eof Then
	EventLocationWebsiteID = rs("WebsitesID")
End If 

sql = "select WebsitesID from websites where Website = '" & BusinessWebsite & "' order by WebsitesID Desc;" 

Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

If Not rs.eof Then
	BusinessWebsiteID = rs("WebsitesID")
End If 


sql = "select WebsitesID from websites where Website = '" & EventWebsite & "' order by WebsitesID Desc;" 

Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

If Not rs.eof Then
	EventWebsiteID = rs("WebsitesID")
End If 

rs.close


'******************************************************************************************
'  FIND THE ADDRESS ID'S FOR THE LOCATION ADDRERSS AND THE BUSINESS ADDRESS
'******************************************************************************************

sql = "select * from Address where AddressStreet = '" & EventLocationStreet  & "' and AddressApt = '" & EventLocationApt & "' and  AddressCity = '" & EventLocationCity & "' and AddressZip = '" & EventLocationZip & "' order by AddressID Desc;" 
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

If Not rs.eof Then
	EventLocationAddressID = rs("AddressID")
End If 

sql = "select * from Address where AddressStreet = '" & BusinessAddress  & "' and AddressApt = '" & BusinessApt & "' and  AddressCity = '" & BusinessCity & "' and AddressZip = '" & BusinessZip & "' order by AddressID Desc;" 

Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

If Not rs.eof Then
	BusinessAddressID = rs("AddressID")
End If 

rs.close

'******************************************************************************************
'  FIND THE PHONE ID'S 
'******************************************************************************************
sql = "select * from Phone where Phone = '" & EventLocationPhone  & "' and Cellphone = '" & EventLocationCell & "' and  fax = '" & EventLocationFax & "' order by PhoneID Desc;" 

Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

If Not rs.eof Then
	EventLocationPhoneID = rs("PhoneID")
End If 

sql = "select * from Phone where Phone = '" & BusinessPhone  & "' and Cellphone = '" & BusinessCell & "' and  fax = '" & BusinessFax & "' order by PhoneID Desc"

Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

If Not rs.eof Then
	BusinessPhoneID = rs("PhoneID")
End If 

rs.close


'******************************************************************************************
'  FIND THE EVENT LOCATION ID
'******************************************************************************************
'response.write("EventID ' " & EventID)
sql = "select  EventLocationName from EventLocation, Event where Event.EventLocationID = EventLocation.EventLocationID and EventID = " & EventID 

Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then
	EventLocationName = rs("EventLocationName")
End If 
rs.close

sql = "select * from Event, EventTypesLookup where EventTypesLookup.EventTypeID = Event.EventTypeID and EventID = " & EventID  
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then
	EventName = rs("EventName")
	EventDescription = rs("EventDescription")
	PublishedDate = rs("PublishedDate")
	EventStartMonth = rs("EventStartMonth")
	EventStartDay = rs("EventStartDay")
	EventStartYear = rs("EventStartYear")
	EventEndMonth = rs("EventEndMonth")
	EventEndDay = rs("EventEndDay")
	EventEndYear = rs("EventEndYear")
    EventType = rs("EventType")
    EventTypeID = rs("EventTypeID")
    EventStatus = rs("EventStatus")
    Paid = rs("Paid")
	AOBA = rs("AOBA")
	AOBAFee = rs("AOBAFee")
	
	str1 = EventDescription
	str2 = "''"
	If InStr(str1,str2) > 0 Then
		EventDescription= Replace(str1,  str2, "'")
	End If  
End If 

rs.close


sql = "select * from EventTypesLookup where  EventTypeID = " & EventTypeID  

Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then
  EventType = rs("EventType")
  FullPrice = rs("FullPrice")
    DiscountPrice= rs("DiscountPrice")
  DiscountEndDate = rs("DiscountEndDate")
end if

If datediff("d", now, DiscountEndDate ) > 1 then
  
end if

sql = "select ServiceType from ServiceTypeLookup, services where services.ServiceTypeLookupID = ServiceTypeLookup.ServiceTypeLookupID and  EventID = " & EventID  
'response.write("sql=" & sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
while Not rs.eof 
 if rs("ServiceType") = "Halter Show" then
    ShowHalterShow = True 
End If
 
 if rs("ServiceType")  = "Fleece Show" then
   ShowFleeceShow = True 
End If
    
      
if rs("ServiceType")  = "SpinOff" then
   ShowSpinOff = True 
End If

 if rs("ServiceType")  = "Advertising" then
     AdvertisingShow = True 
End If

if tempservicetype = "Stud Auction" then
      ShowStudauction = True 
End If


 if rs("ServiceType")  = "Vendors" then
       ShowVendors = True 
     End If

 if rs("ServiceType")  = "Sponsor" then
       ShowSponsors = True 
     End If

 if rs("ServiceType")  = "Classes / Workshops" then
       ShowClasses = True 
     End If

   if rs("ServiceType")  = "Dinner" then
       ShowDinner = True 
     End If


 if rs("ServiceType")  = "Silent Auction" then
       ShowSilentauction = True 
     End If

rs.movenext
wend

PageTitleText = EventName & " Dashboard"  %>
<% if screenwidth < 800 then %>
<table border = "0" cellspacing="0" cellpadding = "0" align = "left" width = "<%=screenwidth - 20 %>">
<% else %>
<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "<%=screenwidth - 20 %>">
<% end if %>
<tr><td class = "roundedtop" align = "left">
		<H1><div align = "left"><%=PageTitleText %></div></H1>
</td></tr>
<tr><td class = "roundedBottom" >

<table border = "0" width = "100%"  bgcolor = "white" cellpadding=0 cellspacing=0  align = "center" ><tr><td>

<table border = "0" width = "100%"  bgcolor = "white" cellpadding=0 cellspacing=0  align = "center" >
<tr><td width = "475" valign = "top">
<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "100%"><tr><td class = "roundedtop" align = "left">
		<H1><div align = "left">Event Facts</div></H1>
</td></tr>
<tr><td class = "roundedBottom" >

	
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  width = "450" align = "center">
<tr><td class = "body2" valign = "bottom" colspan = "4" >
<a name = "Basics"></a>
	<h2><%=EventName %></h2>
</td></tr>
<tr><td class = "body2" colspan = "4" bgcolor = "#abacab" height = "1"></td></tr>
<tr>
		<td class = "body2" align = "right" width = "80">
			Event Type: &nbsp;
		</td>
		<td class = "body2" width = "140" align = "left">
			<%=EventType %>
		</td>
		<td  class = "body2" align = "right" width = "80">
					<% if len(EventLocationName) > 1 then %>Location: &nbsp;<%end if %></td>
				</td>
				<td class = "body2"  align = "left">
					
		<%=EventLocationName %>
    	</td>
	</tr>
	
	<tr>
		<td class = "body2" align = "right">
			Start Date: &nbsp;</td>
		<td class = "body2" align = "left">
				<%=EventStartMonth %>/<%= EventStartDay %>/<%=EventStartYear %>
					
		</td>
			<td class = "body2" align = "right">

		<td class = "body2" align = "left">

	   </td>
	   </tr>
	   	   <tr>
	   	   
	   	   <td class = "body2" align = "right">
			End Date: &nbsp;</td>
		<td class = "body2" align = "left">
				<%=EventEndMonth %>/<%=EventEndDay %>/<%=EventEndYear %>
					
		</td>
	
		<td class = "body2" align = "center" colspan = "2">
			<a href = "EditEvent.asp?EventID=<%=EventID%>" class = "body"><b>Edit Event Facts</b></a> 
					
		</td>
	   </tr>
	   <% if EventType = "Alpaca Show" and ( ShowHalterShow = True or ShowFleeceShow = True or ShowSpinOff = True ) then %>
<tr>
  <tr><td class = "body2" valign = "bottom" colspan = "4" >
<br><br>

<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
<script type="text/javascript" src="jquery.numeric.js"></script>

<form  name=halterform method="post" action="AOBAHandleForm.asp?EventID=<%=EventID%>">
 <table border = "0"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  width = "400" align = "center" >
	<tr>
	  <td class = "body" align = "right">
		Is This a AOBA Certified Show?
		</td>
		<td class = "body">
		<% 
		
		if AOBA = "True" then %>
			<INPUT TYPE=RADIO NAME="AOBA" VALUE="Yes" CHECKED  >Yes
			<INPUT TYPE=RADIO NAME="AOBA" VALUE="No"  >No
		<% else %>
			<INPUT TYPE=RADIO NAME="AOBA" VALUE="Yes"         >Yes
			<INPUT TYPE=RADIO NAME="AOBA" VALUE="No" CHECKED >No
		<% end if %>
		</td>
	</tr>
		<tr>
	  <td class = "body" align = "right">
		Show Fee for Non-AOBA Show Division Members: 
		</td>
		<td class = "body" valign = "top">
		$<INPUT class="positive" TYPE=text NAME="AOBAFee" size = 4 maxsize = 5 VALUE="<%=AOBAFee %>" >
	      	<script type="text/javascript">
	      	    $(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	
	</script>

	      

	 </td>
	</tr>

	<tr>
	<td class = "body" colspan = "2" align = "center">
	<INPUT TYPE=hidden NAME="EventID" VALUE="<%=EventID%>" >
	
	<input type="submit"  value="Submit" class = "Regsubmit2" ><br>
	
	
	</td>
	</tr>

</form>
</table>

</td>
</tr>
<% end if %>

     </table>
</td></tr></table>

<br>
<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "100%"><tr><td class = "roundedtop" align = "left">
		<H1><div align = "left">Event Status</div></H1>
</td></tr>
<tr><td class = "roundedBottom" >

  <% 
  if len(EventStatus) > 0 then
  else
  EventStatus = "Draft"
  end if
  
  if EventStatus = "Draft" or len(EventStatus) < 1 then %> 
     <table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=2 cellspacing=2  width = "450" align = "center">
<tr>
		<td class = "body2" >
EventStatus = <%=EventStatus %>


<% 
if eventtypeid = 5 then
   Paid = true
end if

notyet = False
    Paid = True
 If Paid = False then %>
 
 <table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=2 cellspacing=2  width = "450" align = "center">
<tr>
		<td class = "body2" width = "300" align = "left">
		<h2>Status - Draft</h2>
		Before you can publish your event you need to pay for your registration. To pay please use the pay now button to the right.<br />
		<br />
		<%  If datediff("d", now, DiscountEndDate ) > 1 then 
             CurrentPrice = DiscountPrice 
        %>
               &nbsp;&nbsp;Full Price: <strike><%=formatcurrency(FullPrice,2)  %></strike><br />
               &nbsp;&nbsp;<b>Discount Price: <%=formatcurrency(DiscountPrice,2) %></b><br />
              &nbsp;&nbsp;Discount Ends: <%=DiscountEndDate %><br />
          <% else 
             CurrentPrice = FullPrice  %>
              &nbsp;&nbsp;<b>Price:<%=formatcurrency(FullPrice,2)  %></b><br />
            <% end if  %>
		
		<br />
		<br />
		
		
            
		 </td>
		<td class = "body" align = "center" valign = "bottom">
		<form target="paypal" action="https://www.sandbox.paypal.com/cgi-bin/webscr" method="post">
    <input type="hidden" name="cmd" value="_xclick"> 
    <input type="hidden" name="upload" value="1">   
    <input type="hidden" name="business" value="johna_1282413342_biz@webartists.biz">   
    <input type="hidden" name="item_name" value="<%= EventType %> Event Registration">  
     <input type="hidden" name="amount" value="<%= CurrentPrice %>">   
     <input name="custom" type="hidden" id="custom" value="<%=EventID %>"> 
    <input type="hidden" name="return" value="Http://www.AndresenEvents.com/RegManageHome.asp?EventID=<%=EventID %>">
    <input type="hidden" name="cbt" value="Return to Andresen Events">
       <input type="hidden" name="cancel_return" value="Http://www.AndresenEvents.com/RegManageHome.asp?EventID=<%=EventID %>">
    <input type="hidden" name="notify_url" value="Http://www.AndresenEvents.com/EventSetupOrderCompletion.asp">   
<input type="image" src="images/paynow.jpg" border="0" name="submit" >
     </form>
         
         

  		</td>
  	</tr>
  	</table>

  <% else  %>  
      <table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=2 cellspacing=2  width = "450" align = "center">
<tr>
		<td class = "body2" width = "300" align = "left">
		<h2>Status - Un-Published</h2>
		
		<% 
		NotReady =false
		if EventType = "Alpaca Halter Show" then
		 sql = "select * from Services, ServiceTypeLookup where Services.ServiceTypeLookupID = ServiceTypeLookup.ServiceTypeLookupID and ServiceType = 'Halter Show' and EventID =  " & EventID & " Order by ServicesID Desc"
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then	

	FeePerAnimal = rs("Price")
	ServiceStartDateMonth  = rs("ServiceStartDateMonth")
	ServiceStartDateDay  = rs("ServiceStartDateDay")
	ServiceStartDateYear  = rs("ServiceStartDateYear")
end if	

if len(FeePerAnimal) < 1 or FeePerAnimal = 0 then
NotReady = True
%>
<b>Your Event is not ready to be published yet. Please fill out the required fields on the <a href = "halterHome.asp?EventID=<%=EventID%>" class = "body" >Halter Show tab</a>.</b>
<%
end if 
end if



		%>
		
		Your event is currently Un-Published and not available for people to view and sign up for your event yet.
		
		<% if NotReady =false then %>
		
		
		If you wish to publish your event please select the the right. <br /> </td>
		<td class = "body" align = "center" valign = "bottom">
           <form  name=form method="post" action="RegManageHome.asp?EventID=<%=EventID%>&SetLive=True">
		
		<center><input type="Submit"  value="Publish!"  class = "Regsubmit2" ></center><br>
  		</form> 
  		<% end if %>
  		</td>
  	</tr>
  	</table>
<% end if  %>
   </td>
   </tr>
  </table>
  <% end if %>
  
 
  <% if EventStatus = "Published" or len(EventStatus) < 1 then %> 
     <table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=2 cellspacing=2 " width = "450" align = "center">
<tr>
		<td class = "body2" width = "300" align = "left">
		<h2>Status - Published</h2>
		Your event is published and available for people to view and sign up for your event.
		If you want to un-publish your event please select the button to the right. You will be able to re-publish your event later if you wish.<br /> </td>
		<td class = "body" align = "center" valign = "bottom">
		<form  name=form method="post" action="RegManageHome.asp?EventID=<%=EventID%>&SetLive=False">
		
		<input type="Submit"  value="Un-Publish!" class = "Regsubmit2" ><br>
  		</form> 

   </td>
   </tr>
  </table>
  <% end if %>
</td>
</tr>
</table>

<br />
<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "100%"><tr><td class = "roundedtopandbottom" align = "left">
<H2>Event Pages</H2>
 
<form  name=UpdatePagesform method="post" action="RegManageHome.asp?EventID=<%=EventID%>&UpdatePages=True">

	<table border = "0"  width = "100%" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
	<tr >
	<td class = "body" align = "center" width = "180" height = "25"><b>Page</b></td>
	<td class = "body" align = "center" width = "200"><% if not EventTypeID=5 then %><b>Include In Event</b>
	<% end if %>
	</td>
	<td class = "body"  align = "center" ><b>Actions</b></td>
	</tr>

<% 
order = "odd"	
sql2 = "select * from EventPagelayout where not(PageName='Photo Contest') and not(PageName='Accomodations') and not(PageName='Refunds') and not(PageName='Driving Directions') and PageAvailable = True and EventID = " & EventID & " order by LinkOrder"	
	acounter = 1
	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3 
	
	While Not rs2.eof 
	ShowPage = rs2("ShowPage")
	
	 if order = "even" then
	  	order = "odd" %>
	  	<tr bgcolor = "#eeeeee">
	  	
	 <% else
	     order = "even" %>
	 	<tr bgcolor = "white">    
	<% end if %> 
 
 	 <td class = "body"><a href = "<%=rs2("EditLink")%>" class= "body" ><%=rs2("PageName")%></a></td>
 	 <td class = "body" align = "center" width = "80">


 	 	<% if rs2("PageName") ="Event Home" then %>
 	 	     <% if not EventTypeID=5 then %>   Always <% end if %>
 	 	    <% else %>   
 	 	<% if ShowPage  = 1 then %>
 	 	    <input type="checkbox" name="ShowSitePages" value="<%=rs2("PageName") %>" checked>Yes
 	 	<% else %>
 	 	    <input type="checkbox" name="ShowSitePages" value="<%=rs2("PageName") %>" >No
 	 	<% end if %>
 	 	<% end if %>
 	 	</td>
	 <td class = "body" align = "center">
	  <%  PageFound= False
	  
	  
	  if rs2("PageName") = "Halter Show" Then
	     PageFound= True  %>
	  	 <a href = "RegManageHome.asp?EventID=<%=EventID%>" class = "body"><img src= "images/edit.gif" alt = "edit" height ="26" width = "22" border = "0"></a> | 
	 <a href = "HalterAddAnimal.asp&EventID=<%=EventID%>" class = "body">Add Animals</a>
        <% end if %>

		<% if PageFound= False then %>
			<a href = "<%=rs2("EditLink")%>" class= "body" ><img src= "images/edit.gif" alt = "edit" height ="26" width = "22" border = "0"></a>
		<% end if %>

	 </td>
	 </tr>
 <% 
	rs2.movenext
 Wend 
 
 
 %>
 <% if not EventTypeID = 5 then %>
<tr><td class = "body" colspan = "3" align = "center"><b>Other Pages</b></td></tr>
<% end if %> 
<% sql2 = "select * from EventPagelayout where (PageName='Photo Contest' or PageName='Accomodations' or PageName='Refunds' or PageName='Driving Directions') and PageAvailable = True and EventID = " & EventID & " order by LinkOrder"	
	
	acounter = 1
	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3 
	
	While Not rs2.eof 
	ShowPage = rs2("ShowPage")
	 if order = "even" then
	  	order = "odd" %>
	  	<tr bgcolor = "#eeeeee">
	  	
	 <% else
	     order = "even" %>
	 	<tr bgcolor = "white">    
	<% end if %> 
 
 	 <td class = "body"><a href = "<%=rs2("EditLink")%>" class= "body" ><%=rs2("PageName")%></a></td>
 	 	<td class = "body" align = "center" width = "80">
 	 	<% if rs2("PageName") ="Event Home" then %>
 	 	        Always
 	 	    <% else %>   
 	 	<% if ShowPage  = 1 then %>
 	 	    <input type="checkbox" name="ShowSitePages" value="<%=rs2("PageName") %>" checked>Yes
 	 	<% else %>
 	 	    <input type="checkbox" name="ShowSitePages" value="<%=rs2("PageName") %>" >No
 	 	<% end if %>
 	 	<% end if %>
 	 	</td>
	 <td class = "body" align = "center">
	  <%  PageFound= False
	  
	  
	  if rs2("PageName") = "Halter Show" Then
	     PageFound= True  %>
	  	 <a href = "RegManageHome.asp?EventID=<%=EventID%>" class = "body"><img src= "images/edit.gif" alt = "edit" height ="26" width = "22" border = "0"></a> | 
	 <a href = "HalterAddAnimal.asp&EventID=<%=EventID%>" class = "body">Add Animals</a>
        <% end if %>

		<% if PageFound= False then %>
			<a href = "<%=rs2("EditLink")%>" class= "body" ><img src= "images/edit.gif" alt = "edit" height ="26" width = "22" border = "0"></a>
		<% end if %>

	 </td>
	 </tr>
 <% 
	rs2.movenext
 Wend %>


<% if not EventTypeID = 5 then %>
		<tr>
	<td class = "body" colspan = "3" align = "center">
	<center><input type="submit"  value="Submit" class = "regsubmit2" ></center><br>

	</td>
	</tr>
<% end if %>
</form>
</table>
</td>
</tr></table>
</td>
<% if screenwidth > 800 then %>
<td width = "4"><img src = "images/px.gif" width = "1" height = "1"/></td>
<td width = "475" valign= "top">
<% else %>
</tr>
<tr>
<td width = "100%" valign= "top">
<% end if %>
<% if EventTypeID = 5 then %>
<% PageTitleText = "Cost per Registration"  
%>

<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "100%"><tr><td class = "roundedtop" align = "left">
		<H2><div align = "left">Key</div></H2>
</td></tr>
<tr><td class = "roundedBottom">
<% if EventTypeID = 5 then %>
<table><tr><td class = "body"><b>Registrations are Free.</b></td></tr></table>
<% end if %>
</td></tr></table>
<% end if %>




<% PageTitleText = "Registrations"  

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
<br />
<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "100%"><tr><td class = "roundedtop" align = "left">
		<H2><div align = "left">Registration</div></H2>
</td></tr>
<tr><td class = "roundedBottom">

<table border = "0" width ="460" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 align = 'center'>
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
    
    
  sqlfound = false 

if sqlfound = false then    
 sql = "select * from ordersSetupEvents where  EventID = " & EventID & " and Payment_Status = 'Completed' order by DateAdded Desc"
end if

    
rs.Open sql, conn, 3, 3   
rowcount = 1
	
Recordcount = rs.RecordCount +1
if Recordcount > 1 then %>
<table width = "460" border = "0" bordercolor = "white"  cellpadding=0 cellspacing=0 align = "center">
	<tr >
	<th class = "body" align = "center" ><a href = "AddRegistration.asp?EventID=<%=EventID %>" class= "body">Add a  Registration</a></th>
	<th class = "body" ><a href = "ReportRegistrationsList.asp" class= "body">View Expanded List</a></th>
</tr>
</table>
<br />
<table width = "460" border = "0" bordercolor = "white"  cellpadding=0 cellspacing=0 align = "center">
	<tr bgcolor = "#eeeeee">
	<th class = "body" align = "center"  width = "80"><b>Date</b></th>
	<th class = "body" width = "200"><b>Registrant</b></th>
	<% if not EventTypeID = 5 then %>
	<th class = "body" width ='90' ><b>Amount Paid</b></th>
	<% end if %>
		<th class = "body" width = '90'><b>Actions</b></th>
</tr>
	
<%

order = "Even"
    OldPeopleID = ""
    NextPeopleID = ""
    oldTotalPaid = ""
    different = False
    
 While  Not rs.eof 
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
		<%
		
	
		sql2 = "SELECT datediff('m', '" & DateAdded(rowcount) & "' ,  RegistrationDateTime  ) AS timepassed, * from Registration where PeopleID = " & OrderPeopleID(rowcount) & " and Quantity > 0 and EventID=" & EventID 
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
    

	rs2.movenext
	wend  
	  %>	
	
		<% if not EventTypeID = 5 then %>
		<td class = "body" valign = "Top" align = "right">
		    <% if len(Payment_amount(rowcount))> 0 then %><%=formatcurrency(Payment_amount(rowcount),2) %> <% end if %>
		    
		    <%
		    
		    if len(Payment_amount(rowcount)) > 0 then
		     EventTotalIncome = EventTotalIncome + Payment_amount(rowcount) 
		     end if
		     %>
		</td>
		<% end if %>
		<td class = "body" valign = "Top" align = "right" width = '90'>
	<a href = "RegistrationEditDetails.asp?OrderEventID=<%=OrderEventID(rowcount)%>"><img src = "images/preview_on.gif" width = "15" border = "0" alt = "View Registration"></a>
	<% showedit = True
	if showedit = True then %>
		<a href = "ReportsEventRegisterEdit.asp?OrderEventID=<%=OrderEventID(rowcount)%>&CurrentpeopleID=<%=OrderPeopleID(rowcount) %>"><img src= "images/edit.gif" alt = "edit" height ="26" width = "22" border = "0"></a>
	<% end if %>
	      <a href = "RegistrationDeleteHandleForm0.asp?OrderEventID=<%=OrderEventID(rowcount)%>&EventID=<%=EventID%>"><img src = "images/delete.jpg" width = "15" border = "0" alt = "Delete Registration"></a>

		</td></tr>
	
<% 
end if


		rowcount = rowcount + 1
	   rs.movenext
	Wend
TotalCount=rowcount 
	rs.close
%>
<% if not EventTypeID = 5 then %>
<tr>
<td colspan = "2" class = "body" align = "right"><b>Total Income:</b></td>
<td  class = "body" align = "right"><b><%=formatcurrency(EventTotalIncome , 2) %></b></td>
<td ></td>
</tr>
<% end if %>
</table>

<% else %>
<div class = "body"><b>Currently there are no orders.</b></div>

<% end if %>
 <br>
 
</td></tr>
</table>
</td></tr></table>

<% if len(screenwidth) > 800 then %>
<br />
<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "100%"><tr><td class = "roundedtop" align = "left">
		<H2><div align = "left">Key</div></H2>
</td></tr>
<tr><td class = "roundedBottom">
<table border = "0" cellpadding = "0" cellspacing="0" width = "100%" align = "center">
 <tr>
 <td class = "body" width = "20"><img src = "images/preview_on.gif" width = "15" border = "0" alt = "View Registration"></td>
 <td class = "body" width = "95">View</td>
  <td class = "body" width = "20"><img src= "images/edit.gif" alt = "edit" height ="26" width = "22" border = "0"></td>
 <td class = "body" width = "95">Edit</td>
  <td class = "body" width = "20"><img src = "images/delete.jpg" width = "15" border = "0" alt = "Delete Registration"></td>
 <td class = "body" width = "95">delete</td>
   <td class = "body" width = "20"><img src = "images/Photo.gif" width = "15" border = "0" alt = "Upload Photos"></td>
 <td class = "body" width = "95">Upload Photos</td>
 </tr>
</table>
</td>
 </tr>
</table>
<% end if %>
</td>
</tr>
</table>
</td>
</tr>
</table>


</td></tr></table>
<!--#Include file="Footer.asp"-->
</Body>
</html>