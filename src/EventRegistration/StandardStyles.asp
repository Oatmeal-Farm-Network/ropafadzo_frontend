<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
<head>
<!--#Include file="globalvariables.asp"--> 
 <title>Edit Website Layout</title>
 <% Page = "Editwebsite" %>
       <link rel="stylesheet" type="text/css" href="/administration/Framestyle.css">
	

</head>
<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">

<% EventID= session("EventID")
'response.write("session  eventID=" & EventID ) %>


<table width = "800" height = "450" bgcolor = "white" border = "0" cellspacing = "0" cellpadding = "0"><tr><td>
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
	

		H1 {font: 16pt arial; font-weight:  bold ;   color: black ; text-align: center; PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; LINE-HEIGHT: 36px; PADDING-TOP: 0px; }
		H2 {font: 12pt arial;  font-weight:  bold ;  color: black; text-align: center; PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; LINE-HEIGHT: 26px; PADDING-TOP: 0px; }
		.BodyText {font: 10pt arial; font-weight:  normal ;   color: black; PADDING-RIGHT: 0px; PADDING-LEFT: 5px; PADDING-BOTTOM: 0px; MARGIN: 0px; LINE-HEIGHT: 16px; PADDING-TOP: 0px;  }

</style>


	<SCRIPT type="text/javascript">
	var dhtmlgoodies_tooltip = false;
	var dhtmlgoodies_tooltipShadow = false;
	var dhtmlgoodies_shadowSize = 4;
	var dhtmlgoodies_tooltipMaxWidth = 200;
	var dhtmlgoodies_tooltipMinWidth = 100;
	var dhtmlgoodies_iframe = false;
	var tooltip_is_msie = (navigator.userAgent.indexOf('MSIE')>=0 && navigator.userAgent.indexOf('opera')==-1 && document.all)?true:false;
	function showTooltip(e,tooltipTxt)
	{
		
		var bodyWidth = Math.max(document.body.clientWidth,document.documentElement.clientWidth) - 20;
	
		if(!dhtmlgoodies_tooltip){
			dhtmlgoodies_tooltip = document.createElement('DIV');
			dhtmlgoodies_tooltip.id = 'dhtmlgoodies_tooltip';
			dhtmlgoodies_tooltipShadow = document.createElement('DIV');
			dhtmlgoodies_tooltipShadow.id = 'dhtmlgoodies_tooltipShadow';
			
			document.body.appendChild(dhtmlgoodies_tooltip);
			document.body.appendChild(dhtmlgoodies_tooltipShadow);	
			
			if(tooltip_is_msie){
				dhtmlgoodies_iframe = document.createElement('IFRAME');
				dhtmlgoodies_iframe.frameborder='5';
				dhtmlgoodies_iframe.style.backgroundColor='#FFFFFF';
				dhtmlgoodies_iframe.src = '#'; 	
				dhtmlgoodies_iframe.style.zIndex = 100;
				dhtmlgoodies_iframe.style.position = 'absolute';
				document.body.appendChild(dhtmlgoodies_iframe);
			}
			
		}
		
		dhtmlgoodies_tooltip.style.display='block';
		dhtmlgoodies_tooltipShadow.style.display='block';
		if(tooltip_is_msie)dhtmlgoodies_iframe.style.display='block';
		
		var st = Math.max(document.body.scrollTop,document.documentElement.scrollTop);
		if(navigator.userAgent.toLowerCase().indexOf('safari')>=0)st=0; 
		var leftPos = e.clientX + 10;
		
		dhtmlgoodies_tooltip.style.width = null;	// Reset style width if it's set 
		dhtmlgoodies_tooltip.innerHTML = tooltipTxt;
		dhtmlgoodies_tooltip.style.left = leftPos + 'px';
		dhtmlgoodies_tooltip.style.top = e.clientY + 10 + st + 'px';

		
		dhtmlgoodies_tooltipShadow.style.left =  leftPos + dhtmlgoodies_shadowSize + 'px';
		dhtmlgoodies_tooltipShadow.style.top = e.clientY + 10 + st + dhtmlgoodies_shadowSize + 'px';
		
		if(dhtmlgoodies_tooltip.offsetWidth>dhtmlgoodies_tooltipMaxWidth){	/* Exceeding max width of tooltip ? */
			dhtmlgoodies_tooltip.style.width = dhtmlgoodies_tooltipMaxWidth + 'px';
		}
		
		var tooltipWidth = dhtmlgoodies_tooltip.offsetWidth;		
		if(tooltipWidth<dhtmlgoodies_tooltipMinWidth)tooltipWidth = dhtmlgoodies_tooltipMinWidth;
		
		
		dhtmlgoodies_tooltip.style.width = tooltipWidth + 'px';
		dhtmlgoodies_tooltipShadow.style.width = dhtmlgoodies_tooltip.offsetWidth + 'px';
		dhtmlgoodies_tooltipShadow.style.height = dhtmlgoodies_tooltip.offsetHeight + 'px';		
		
		if((leftPos + tooltipWidth)>bodyWidth){
			dhtmlgoodies_tooltip.style.left = (dhtmlgoodies_tooltipShadow.style.left.replace('px','') - ((leftPos + tooltipWidth)-bodyWidth)) + 'px';
			dhtmlgoodies_tooltipShadow.style.left = (dhtmlgoodies_tooltipShadow.style.left.replace('px','') - ((leftPos + tooltipWidth)-bodyWidth) + dhtmlgoodies_shadowSize) + 'px';
		}
		
		if(tooltip_is_msie){
			dhtmlgoodies_iframe.style.left = dhtmlgoodies_tooltip.style.left;
			dhtmlgoodies_iframe.style.top = dhtmlgoodies_tooltip.style.top;
			dhtmlgoodies_iframe.style.width = dhtmlgoodies_tooltip.offsetWidth + 'px';
			dhtmlgoodies_iframe.style.height = dhtmlgoodies_tooltip.offsetHeight + 'px';
		
		}
				
	}
	
	function hideTooltip()
	{
		dhtmlgoodies_tooltip.style.display='none';
		dhtmlgoodies_tooltipShadow.style.display='none';		
		if(tooltip_is_msie)dhtmlgoodies_iframe.style.display='none';		
	}
	
	</SCRIPT>	
<% 
  sql = "select * from EventSiteDesigntemp where EventID=" & EventID
'response.write(sql) 
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3
    if rs.eof then

    	Query =  "INSERT INTO EventSiteDesigntemp (EventID)" 
		Query =  Query & " Values (" &  EventID  & ")"
		'response.write(Query)	
		Conn.Execute(Query) 


		sql = "select * from EventSiteDesigntemp where custid=66 "
		'response.write(sql)
		
		Set rs = Server.CreateObject("ADODB.Recordset")
   		rs.Open sql, conn, 3, 3   
		Header = rs("Header")
		logo = rs("Logo")
		sql = "select * from EventSiteDesigntemp where custid=66 "
'response.write(sql)
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3 

end if

   
Header = rs("Header")
logo = rs("Logo")
sql = "select * from EventSiteDesigntemp where EventID=" & EventID
'response.write(sql)
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3  
	if rs.eof then

    	Query =  "INSERT INTO EventSiteDesigntemp (EventID)" 
		Query =  Query & " Values (" &  EventID  & ")"
		'response.write(Query)	
		Conn.Execute(Query) 


		sql = "select * from EventSiteDesigntemp where custid=66 "
		'response.write(sql)
		
		Set rs = Server.CreateObject("ADODB.Recordset")
   		rs.Open sql, conn, 3, 3   
		Header = rs("Header")
		logo = rs("Logo")
		sql = "select * from EventSiteDesigntemp where custid=66 "
'response.write(sql)
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3 

end if
		Header = rs("Header")
		logo = rs("Logo")

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

%>

<a name="Top"></a>



<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "899" ><tr><td  bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr></table>

<br>
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "899">
	<tr>
		<td class = "body" width = "430" valign = "top">
		<form action= "StandardStyles.asp?EventID=<%=EventID%>" method = "post">	 
		   <table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "440">
				<tr>
					<td class ="body" colspan = "2" bgcolor = "DBF5F2" >
						<a name = "select"></a><h2>Page Layout Settings</h2>
					</td>
				</tr>
				<tr>
					<td class ="BodyText" colspan = "2" >
						The settings below control the overall layout of your 
						website. As you make changes they will automatically be applied to the preview to the right; however, they will not effect your website until you select the "Publish!" button.<br><br>
					</td>
			 </tr>
			 
<tr>
		<td class = "small" align = "right">
			 <a href="#" class = "small" onmouseout="hideTooltip()" onmouseover="showTooltip(event,'Please see explanation below');return false">Layout Style:</a>
		</td>
		<td >
			<select size="1" name="LayoutStyle" onchange="submit();" style="width:180">
					<option value= "<%=LayoutStyle%>" selected><%=LayoutStyle%></option>
					<% if not LayoutStyle = "Classic Portrait" then %>	
						<option value= "Classic Portrait" >Classic Portrait</option>
					<% end if %>
					<% if not LayoutStyle = "Modern Portrait" then %>	
						<option value= "Modern Portrait" >Modern Portrait</option>
					<% end if %>
					<% if not LayoutStyle = "Classic Landscape" then %>	
						<option value= "Classic Landscape" >Classic Landscape</option>
					<% end if %>
					<% if not LayoutStyle = "Modern Landscape" then %>	
						<option value= "Modern Landscape" >Modern Landscape</option>
					<% end if %>
					</select>
		</td>
	</tr>
	

<tr>
		<td class = "small" align = "right">
			<a href="#" class = "small" onmouseout="hideTooltip()" onmouseover="showTooltip(event,'This color is seen in the body of your pages, unless you have uploaded a Page Background Image. To upload a Page Background Image go to the bottom of this page.');return false">Page Background Color:</a>
		</td>
		<td>
			<select size="1" name="PageBackgroundColor" onchange="submit();" style="width:180">
					<option value= "<%=PageBackgroundColor%>" selected><%=PageBackgroundColor%></option>
					<!--#Include file="ColorOptionsInclude.asp"--> 		
					</select>
		</td>
	</tr>
<tr>
		<td class = "small" align = "right">
			<a href="#" class = "small" onmouseout="hideTooltip()" onmouseover="showTooltip(event,'This color is seen behind your menu links, unless you have uploaded a Menu Background Image. To upload a Menu Background Image go to the bottom of this page.');return false">Menu Background Color:</a>
		</td>
		<td>
			<select size="1" name="MenuBackgroundColor" onchange="submit();" style="width:180">
					<option value= "<%=MenuBackgroundColor%>" selected><%=MenuBackgroundColor%></option>
						<!--#Include file="ColorOptionsInclude.asp"--> 	
					</select>
					
		</td>
	</tr>



</table>	
</form>
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "440">
 <tr>
	<td class ="body" colspan = "2" bgcolor = "DBF5F2" >
		<h2>Layout Styles</h2>
	</td>
</tr>
 <tr>
	<td class ="body" colspan = "2" align = "center">
		<img src = "images/layoutstyles.jpg" align = "center">
	</td>
</tr>

			
</table>
	
	
	
	
	
		</td>
		<td width = "1" bgcolor = "black"><img src = "images/px.gif" width = "1" height = "340"></td>
		<td class = "body" width = "400" valign = "top" >
	  <table border = "0" cellpadding = "0" cellspacing = "0"><tr><td bgcolor = "DBF5F2" ><a name = "preview"></a>
	<h2>Preview</h2></td></tr>
	<tr><td class ="BodyText">
			Below is a rough approximation of your site to show your design, with no text or links. Everything is at 50% it's final size.<br><br>
   <br>
<center>
  
<% 'response.write("Session(eventID=" & Session("EventID")) %>
			<iframe src ="FrameDesign.asp" width="460" height="380"  frameborder = "2" scrolling = "no" >
			 <p>Your browser does not support iframes.</p>
			</iframe>

  

		</td>
	</tr>
</table>
		</td>
	</tr>
</table>


	
<!-- #include virtual="/administration/Footer.asp" -->
 </Body>
</HTML>
