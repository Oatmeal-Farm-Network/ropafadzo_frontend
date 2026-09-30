<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html >
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="Content-Language" content="en-us">
<%  PageName = "Registry" %>
<!--#Include file="AdminEventGlobalVariables.asp"-->
<title>Page Setup</title>
<meta http-equiv="Content-Language" content="en-us">

<style type="text/css">
	
	#dhtmlgoodies_tooltip{
		background-color:#EEE;
		border:1px solid #000;
		position:absolute;
		display:none;
		z-index:20000;
		padding:2px;
		font-size:0.9em;
		-moz-border-radius:6px;	/* Rounded edges in Firefox */
		font-family: "Trebuchet MS", "Lucida Sans Unicode", Arial, sans-serif;
		
	}
	#dhtmlgoodies_tooltipShadow{
		position:absolute;
		background-color:#555;
		display:none;
		z-index:10000;
		opacity:0.7;
		filter:alpha(opacity=70);
		-khtml-opacity: 0.7;
		-moz-opacity: 0.7;
		-moz-border-radius:6px;	/* Rounded edges in Firefox */
	}
	

</style>


	<SCRIPT type="text/javascript">
	    var dhtmlgoodies_tooltip = false;
	    var dhtmlgoodies_tooltipShadow = false;
	    var dhtmlgoodies_shadowSize = 4;
	    var dhtmlgoodies_tooltipMaxWidth = 200;
	    var dhtmlgoodies_tooltipMinWidth = 100;
	    var dhtmlgoodies_iframe = false;
	    var tooltip_is_msie = (navigator.userAgent.indexOf('MSIE') >= 0 && navigator.userAgent.indexOf('opera') == -1 && document.all) ? true : false;
	    function showTooltip(e, tooltipTxt) {

	        var bodyWidth = Math.max(document.body.clientWidth, document.documentElement.clientWidth) - 20;

	        if (!dhtmlgoodies_tooltip) {
	            dhtmlgoodies_tooltip = document.createElement('DIV');
	            dhtmlgoodies_tooltip.id = 'dhtmlgoodies_tooltip';
	            dhtmlgoodies_tooltipShadow = document.createElement('DIV');
	            dhtmlgoodies_tooltipShadow.id = 'dhtmlgoodies_tooltipShadow';

	            document.body.appendChild(dhtmlgoodies_tooltip);
	            document.body.appendChild(dhtmlgoodies_tooltipShadow);

	            if (tooltip_is_msie) {
	                dhtmlgoodies_iframe = document.createElement('IFRAME');
	                dhtmlgoodies_iframe.frameborder = '5';
	                dhtmlgoodies_iframe.style.backgroundColor = '#FFFFFF';
	                dhtmlgoodies_iframe.src = '#';
	                dhtmlgoodies_iframe.style.zIndex = 100;
	                dhtmlgoodies_iframe.style.position = 'absolute';
	                document.body.appendChild(dhtmlgoodies_iframe);
	            }

	        }

	        dhtmlgoodies_tooltip.style.display = 'block';
	        dhtmlgoodies_tooltipShadow.style.display = 'block';
	        if (tooltip_is_msie) dhtmlgoodies_iframe.style.display = 'block';

	        var st = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
	        if (navigator.userAgent.toLowerCase().indexOf('safari') >= 0) st = 0;
	        var leftPos = e.clientX + 10;

	        dhtmlgoodies_tooltip.style.width = null; // Reset style width if it's set 
	        dhtmlgoodies_tooltip.innerHTML = tooltipTxt;
	        dhtmlgoodies_tooltip.style.left = leftPos + 'px';
	        dhtmlgoodies_tooltip.style.top = e.clientY + 10 + st + 'px';


	        dhtmlgoodies_tooltipShadow.style.left = leftPos + dhtmlgoodies_shadowSize + 'px';
	        dhtmlgoodies_tooltipShadow.style.top = e.clientY + 10 + st + dhtmlgoodies_shadowSize + 'px';

	        if (dhtmlgoodies_tooltip.offsetWidth > dhtmlgoodies_tooltipMaxWidth) {	/* Exceeding max width of tooltip ? */
	            dhtmlgoodies_tooltip.style.width = dhtmlgoodies_tooltipMaxWidth + 'px';
	        }

	        var tooltipWidth = dhtmlgoodies_tooltip.offsetWidth;
	        if (tooltipWidth < dhtmlgoodies_tooltipMinWidth) tooltipWidth = dhtmlgoodies_tooltipMinWidth;


	        dhtmlgoodies_tooltip.style.width = tooltipWidth + 'px';
	        dhtmlgoodies_tooltipShadow.style.width = dhtmlgoodies_tooltip.offsetWidth + 'px';
	        dhtmlgoodies_tooltipShadow.style.height = dhtmlgoodies_tooltip.offsetHeight + 'px';

	        if ((leftPos + tooltipWidth) > bodyWidth) {
	            dhtmlgoodies_tooltip.style.left = (dhtmlgoodies_tooltipShadow.style.left.replace('px', '') - ((leftPos + tooltipWidth) - bodyWidth)) + 'px';
	            dhtmlgoodies_tooltipShadow.style.left = (dhtmlgoodies_tooltipShadow.style.left.replace('px', '') - ((leftPos + tooltipWidth) - bodyWidth) + dhtmlgoodies_shadowSize) + 'px';
	        }

	        if (tooltip_is_msie) {
	            dhtmlgoodies_iframe.style.left = dhtmlgoodies_tooltip.style.left;
	            dhtmlgoodies_iframe.style.top = dhtmlgoodies_tooltip.style.top;
	            dhtmlgoodies_iframe.style.width = dhtmlgoodies_tooltip.offsetWidth + 'px';
	            dhtmlgoodies_iframe.style.height = dhtmlgoodies_tooltip.offsetHeight + 'px';

	        }

	    }

	    function hideTooltip() {
	        dhtmlgoodies_tooltip.style.display = 'none';
	        dhtmlgoodies_tooltipShadow.style.display = 'none';
	        if (tooltip_is_msie) dhtmlgoodies_iframe.style.display = 'none';
	    }
	
	</SCRIPT>	
<% 
EventID = Request.querystring("EventID")
  sql = "select * from EventPageLayout where PageName = 'Event Home' and EventID=" & EventID
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3
    if not rs.eof then
        PageLayoutID = rs("PageLayoutID")
      end if
  rs.close  
    
sql = "select * from EventPageLayout2 where BlockNum = 1 and PageLayoutID = " & PageLayoutID & ";"
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3
    if not rs.eof then
        EventDescription = rs("PageText")
      end if
  rs.close  
  
      sql = "select * from EventPageLayout2 where BlockNum = 4 and PageLayoutID = " & PageLayoutID & ";"
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3
    if not rs.eof then
        EventDescription4 = rs("PageText")
      end if
  rs.close  
       
    
  sql = "select * from EventSiteDesigntemp where EventID=" & EventID
	
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3
    if rs.eof then

    	Query =  "INSERT INTO EventSiteDesigntemp (EventID)" 
		Query =  Query & " Values (" &  EventID  & ")"
		Conn.Execute(Query) 

end if

   

sql = "select * from EventSiteDesigntemp where EventID=" & EventID
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3  
	if rs.eof then

    	Query =  "INSERT INTO EventSiteDesigntemp (EventID)" 
		Query =  Query & " Values (" &  EventID  & ")"
		Conn.Execute(Query) 


		sql = "select * from EventSiteDesigntemp where custid=66 "
		
		Set rs = Server.CreateObject("ADODB.Recordset")
   		rs.Open sql, conn, 3, 3   
		Header = rs("Header")
		logo = rs("Logo")
		sql = "select * from EventSiteDesigntemp where custid=66 "
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3 

end if
		Header = rs("Header")
		logo = rs("Logo")
EventImage= rs("EventImage")
		DBPagewidth = rs("Pagewidth")
		DBPageAlign = rs("PageAlign")
		DBLayoutStyle = rs("LayoutStyle")
		DBScreenBackgroundColor = rs("ScreenBackgroundColor")
		DBPageBorder = rs("PageBorder")
		DBPageBorderColor = rs("PageBorderColor")
		DBMenuBackgroundColor = rs("MenuBackgroundColor")
		DBPageBackgroundColor = rs("PageBackgroundColor")
DBFooterColor = rs("FooterColor")

Pagewidth=Request.Form("Pagewidth" ) 
If Len(Pagewidth) > 1  then
Else
	Pagewidth = DBPagewidth
End If

PageAlign=Request.Form("PageAlign" )
If Len(PageAlign) > 1  then
Else
PageAlign = DBPageAlign
End If



LayoutStyle=Request.Form("LayoutStyle" ) 

If Len(LayoutStyle) > 1  then
Else
	LayoutStyle = DBLayoutStyle
End If

ScreenBackgroundColor=Request.Form("ScreenBackgroundColor" ) 
If Len(ScreenBackgroundColor) > 1  then
Else
ScreenBackgroundColor = DBScreenBackgroundColor
End If


PageBorder=Request.Form("PageBorder" ) 
If Len(PageBorder) > 0  then
Else
PageBorder = DBPageBorder
End If


PageBorderColor=Request.Form("PageBorderColor" ) 
If Len(PageBorderColor) > 1  then
Else
PageBorderColor = DBPageBorderColor
End If

MenuBackgroundColor=Request.Form("MenuBackgroundColor" ) 
If Len(MenuBackgroundColor) > 1  then
Else
MenuBackgroundColor = DBMenuBackgroundColor
End If

PageBackgroundColor=Request.Form("PageBackgroundColor" ) 
If Len(PageBackgroundColor) > 1  then
Else
PageBackgroundColor = DBPageBackgroundColor
End If


FooterColor=Request.Form("FooterColor" ) 
If Len(FooterColor) > 1  then
Else
FooterColor = DBFooterColor
End If




Query =  " UPDATE EventSiteDesigntemp Set LayoutStyle = '" & LayoutStyle & "', "
Query =  Query & " MenuBackgroundColor = '" & MenuBackgroundColor & "' ,"
Query =  Query & " PageBackgroundColor = '" & PageBackgroundColor & "'  "
Query =  Query & " where eventID = " & EventID 

'response.write(Query)	

Conn.Execute(Query) 

If not rs.State = adStateClosed Then
rs.close
End If  
%>
</head>
<% if mobiledevice = True  then %>
<body >
<% else %>
<body onresize="window.location.replace(window.location.href.split('?')[0]  + '?ScreenWidth=' + self.innerWidth);">
<% end if %>

<% Current = "admin" %>
<!--#Include file="AdminEventsHeader.asp"-->
<% Current = "Event Home"%>

<!--#Include file="OverviewHeader.asp"-->
<!--#Include file="Scripts.asp"--><a name="Top"></a>
<table border = "0"  cellspacing="0" cellpadding = "0" width = "<%=screenwidth - 35 %>">
<tr>
  <td colspan = "3">
  
  
  <table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "100%"><tr><td class = "roundedtop" align = "left">
		<H1><div align = "left">Event Page Setup</div></H1>
</td></tr>
<tr><td class = "roundedBottom" >

<table border = "0" cellspacing="0" cellpadding = "0" width = "100%">
<tr>
<% if screenwidth < 800 then %>
  <td colspan = "2">
 <% else %>
 <td colspan = "3">
 <% end if %>
  <table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "<%=screenwidth -50 %>"><tr><td class = "roundedtop" align = "left">
		<H2><div align = "left">Images</div></H2>
</td></tr>
<tr><td class = "roundedBottom">
<div align = "left" class = "body"><b>Images must be in .JPG, .JPEG, .GIF, or .PNG format and less than 300KB in size.</b></div><br>

<table width = "100%" cellpadding = "0" cellspacing = "0" border = "0" align = "center">
  <tr>
    <td width = "180" valign = "top" height = "65">
		<h3>Header Banner</h3> 
		<% If Len(Header) > 1 then%>
		<img src = "<%= Header%>" height = "45">
		<% End If %>
	</td>
<% if screenwidth < 800 then %>
</tr>
<tr>
<% end if %>
	<td class = "body"   valign = "top">
			<form name="frmSend" method="POST" enctype="multipart/form-data" action="uploadHeaderhandle2.asp?EventID=<%=Session("EventID")%>" >
			<% If Header = "ImageNotAvailable.jpg" Then %>
				Current Logo Image Name: Not Defined<br>
			<% End If %>
<% inputsize = 65
    if screenwidth < 989 then 
        inputsize = 65
    end if
      if screenwidth < 800 then 
        inputsize = 55
    end if
     if screenwidth < 700 then 
        inputsize = 45
    end if
     if screenwidth < 600 then 
        inputsize = 35
    end if
    %>
			<input name="attach1" type="file" size=<%= inputsize %> class = "regsubmit2">
			<input  type=submit value=" Upload " class = "regsubmit2">
			</form>
		</td>
		<td align= "left"  valign = "top"><% If Len(Header) > 1 then%><form action= 'RemoveHeader2.asp?EventID=<%=Session("EventID")%>' method = "post">
							<input type = "hidden" name="ImageID" value= "1" >
							<input type = "hidden" name="ID" value= "<%= ID %>" >
							<center><input type=submit value="Remove" class = "regsubmit2"></center>
							</form><% end if %></td>
	</tr>

	<tr><td width = "180" valign = "top" height = "65" valign = "top">
			 <a name = "images">
			<h3>Logo</h3>
			<% If Len(logo) > 1 then%>
				<img src = "<%= logo%>" height = "45">
			<% End If %>
								 
	</td>
	<% if screenwidth < 800 then %>
</tr>
<tr>
<% end if %><td class = "body" valign = "top">
	<form name="frmSend" method="POST" enctype="multipart/form-data" action="uploadLogohandle2.asp?EventID=<%=Session("EventID")%>" >
						
		<% If Logo = "ImageNotAvailable.jpg" Then %>
				Current Logo Image Name: Not Defined<br>
		<% End If %>

		<input name="attach1" type="file" size=<%= inputsize %> class = "regsubmit2" >
		<input  type=submit value="  Upload " class = "regsubmit2"></form>
	</td>
		<td align= "left"  valign = "top">
		<% If Len(logo) > 1 then%>
			<form action= 'RemoveLogo2.asp?EventID=<%=Session("EventID")%>' method = "post">
			<input type = "hidden" name="ImageID" value= "1" >
			<input type = "hidden" name="ID" value= "<%= ID %>" >
			<center><input type=submit value="Remove" class = "regsubmit2"></center>
			</form>
	<% end if %> &nbsp;
		</td>	
			</tr>
			<tr><td width = "180" valign = "top" height = "65">
			 <a name = "images">
			<h3>Event Picture</h3>
			<% If Len(EventImage) > 1 then%>
				<img src = "<%= EventImage%>" height = "45">
			<% End If %>
								 
	</td>
	<% if screenwidth < 800 then %>
</tr>
<tr>
<% end if %><td class = "body"  valign = "top">
	<form name="frmSend" method="POST" enctype="multipart/form-data" action="uploadEventImagehandle2.asp?EventID=<%=Session("EventID")%>" >
						
		<% If Logo = "ImageNotAvailable.jpg" Then %>
				Current Logo Image Name: Not Defined<br>
		<% End If %>

		<input name="attach1" type="file" size=<%= inputsize %> class = "regsubmit2" >
		<input  type=submit value="  Upload " class = "regsubmit2"></form>
	</td>
		<td align= "left"  valign = "top">
		<% If Len(EventImage) > 1 then%>
			<form action= 'RemoveEventImage.asp?EventID=<%=Session("EventID")%>' method = "post">
			<input type = "hidden" name="ImageID" value= "1" >
			<input type = "hidden" name="ID" value= "<%= ID %>" >
			<center><input type=submit value="Remove" class = "regsubmit2"></center>
			</form>
	<% end if %> &nbsp;
		</td>	
			</tr>
</table>
   </td>
</tr>
</table>  
  </td>
  </tr>
<tr>
<td align = "center" valign = "top">  
  	<% if screenwidth < 898 then %>	
</tr><tr><td width = "100%">
<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "100%" >
<% else %>
<td width = "570" valign = "top">
<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "570" height = "632">
<% end if %>
<tr><td class = "roundedtop" align = "left"><a name="Description"></a>
		<H1>Event Description</H1>
        </td></tr>
        <tr><td class = "roundedBottom">
        <script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg.js"></script> 
        <script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg-settings.js"></script>
		<script language="javascript1.2">
  		// attach the editor to the textarea with the identifier 'textarea1'.
  	var mysettings = new WYSIWYG.Settings();
    mysettings.Width = "500px";
    mysettings.Height = "455px";
    WYSIWYG.attach('EventDescription', mysettings);
  		
		</script> 

	<form action= 'EventDescriptionUpdate.asp?EventID=<%=EventID%>' method = "post">
	<input type="hidden" name="PageLayoutID" value = "<%=PageLayoutID%>"  >

			<TEXTAREA NAME="EventDescription" cols="65" rows="18" wrap="file" class = "body" id = "EventDescription"><%=EventDescription%></textarea><br>
	<input type=submit value = "Submit Changes"  size = "110" class = "regsubmit2" >
	 </form>
	 						
	
	    </td></tr>
	    </table>



</td>
  	<% if screenwidth < 898 then %>	
</tr><tr>
<% end if %>
<td align = "center" valign = "top">
		  <table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "100%"><tr><td class = "roundedtop" align = "center"><a name = "PageColors"></a>
		<H1>Page Colors</H1>
        </td></tr>
        <tr><td class = "roundedBottom">
	<form action= "EditEventHome.asp?EventID=<%=EventID%>#PageColors" method = "post">	 
		   <table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "380">

			 
<tr>
		<td class = "small" align = "right">
			<a href="#" class = "body" onmouseout="hideTooltip()" onmouseover="showTooltip(event,'This color is seen in the body of your pages, unless you have uploaded a Page Background Image.');return false">Page Background Color:</a>
		</td>
		<td>
			<select size="1" name="PageBackgroundColor"  style="width:180">
					<option value= "<%=PageBackgroundColor%>" selected><%=PageBackgroundColor%></option>
					<!--#Include file="ColorOptionsInclude.asp"--> 		
					</select>
		</td>
	</tr>
<tr>
		<td class = "small" align = "right">
			<a href="#" class = "body" onmouseout="hideTooltip()" onmouseover="showTooltip(event,'This color is seen behind your your table headings.');return false">Headings Background Color:</a>
		</td>
		<td>
			<select size="1" name="MenuBackgroundColor"  style="width:180">
					<option value= "<%=MenuBackgroundColor%>" selected><%=MenuBackgroundColor%></option>
						<!--#Include file="ColorOptionsInclude.asp"--> 	
					</select>
					
		</td>
	</tr>

<tr>
		<td class = "small" align = "center" colspan = "2">
			<input  type=submit value=" Submit Changes " class = "regsubmit2">
		</td>
	</tr>

		
</table>	
</form>
	
	
	    </td></tr>
	    </table>
<br />

		  <table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "100%"><tr><td class = "roundedtop" align = "center">
		<H1>Fonts</H1>
        </td></tr>
        <tr><td class = "roundedBottom">
     <% if screenwidth < 800 then %>   
<iframe src ="StyleFonts.asp?EventID=<%=EventID %>" width="100%" height = "500" align = "center" frameborder = "0" scrolling = "no" style="background-color:white">
<% else %>
<iframe src ="StyleFonts.asp?EventID=<%=EventID %>" width="100%" height = "380" align = "center" frameborder = "0" scrolling = "no" style="background-color:white">
<% end if %>
<p>Your browser does not support iframes. </p>
</iframe>

        </td>
    </tr>
   </table>    


</td>
</tr>
</table>

</td>
</tr>
</table>


<br><!-- #include virtual="Footer.asp" -->
 </Body>
</HTML>
